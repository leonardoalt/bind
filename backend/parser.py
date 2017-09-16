#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import re
import os
import codecs
import shutil
import subprocess
import json
from polyglot.text import Text


class Parser:

    def __init__(self,pdf_path):
        self.pdf_path = pdf_path
        self.contract_type=''
        self.tif_dir = '/'.join(self.pdf_path.split('/')[:-1])+'/tifs'
        self.txt_dir='/'.join(self.pdf_path.split('/')[:-1])+'/txt'
        self.txt=''
        self.sum=0
    
    def convert_to_tif(self):
        try:
            os.system("mkdir "+self.tif_dir)
            p_convert = subprocess.Popen(["convert", "-density","300","-alpha","Off" , self.pdf_path, self.tif_dir+"/page_%04d.tif"])
            out, error = p_convert.communicate()
            return True
        except Exception as es:
            print str(es)
            return False
        
    def tesseract(self):
        try:
            os.system("mkdir "+self.txt_dir)
            for page in os.listdir(self.tif_dir.replace("\\"," ")):
                p = subprocess.Popen(["tesseract",self.tif_dir+'/'+page,self.txt_dir+'/'+page[:-4],'txt'])
                out,error = p.communicate()
            return True
        except Exception as es:
            print str(es)
            return False
            
    def read_txt(self):
        for f in sorted(os.listdir(self.txt_dir)):
            self.txt+="\n"+codecs.open(self.txt_dir+'/'+f,'r','utf8').read()

        cleantext = self.txt.replace("\n\n","PARAGRAPH")
        cleantext = cleantext.replace("\n"," ")
        cleantext = cleantext.replace("PARAGRAPH","\n\n")
        self.txt = cleantext


        
    def extract_parties(self,ners):
        pers_tmp=[]
        for el in ners:
            
            if el.tag == "I-PER" and len(el)>1:
                pers_tmp.append(el)
        print pers_tmp
        if len(pers_tmp)==1:
            return ' '.join(pers_tmp[0]),''
        if len(pers_tmp)==0:
             return '',''
        
        pers=[]
        i=0
        lastadded=0
        while i in range(len(pers_tmp)-1):

            if re.search(' '.join(pers_tmp[i])+'( +(and|&) +)'+' '.join(pers_tmp[i+1]),self.txt)!=None:
                pers.append(re.search(' '.join(pers_tmp[i])+'( +(and|&) +)'+' '.join(pers_tmp[i+1]),self.txt).group(0))
                i+=1
                lastadded=i
            else:
                pers.append(pers_tmp[i])
            i+=1
        if lastadded !=len(pers_tmp):
            pers.append(pers_tmp[-1])
        if isinstance(pers[0], list):
            entityindex = self.txt.index(" ".join(pers[0]))
            ponestring=" ".join(pers[0])
        else:
            entityindex = self.txt.index(pers[0])
            ponestring=pers[0]
            
        if isinstance(pers[1], list):
            ptwostring=" ".join(pers[1])
        else:
            ptwostring=pers[1]

        context = self.txt[entityindex-100:entityindex+100]
        if self.contract_type=="rental":
            try:
                if "tenant" in context.lower():
                    tenantindex=context.lower().index("tenant")
                elif "lessee" in context.lower():
                    tenantindex=context.lower().index("lessee")
                else: 
                     raise Exception('no mention!')
                if "landlord" in context.lower():
                    landlordindex=context.lower().index("landlord")
                elif "lessor" in context.lower():
                    landlordindex=context.lower().index("lessor")
                else:
                     raise Exception('no mention!')
                entityindex = context.lower().index(ponestring)
                print tenantindex
                print entityindex
                print landlordindex
                if abs(tenantindex-entityindex)< abs(landlordindex-entityindex):
                
                    tenant=ponestring
                    landlord=ptwostring
                else:
                    tenant=ptwostring
                    landlord =ponestring
            except:
                tenant=ptwostring
                landlord = ponestring
            
            return landlord, tenant
        else:
            try:
                if "seller" in self.txt.lower():
                    landlordindex=self.txt.lower().index("seller")
                elif "vendor" in self.txt.lower():
                    landlordindex=self.txt.lower().index("vendor")
                else:
                    raise Exception('no mention!')
                if "buyer" in self.txt.lower():
                    tenantindex=self.txt.lower().index("buyer")
                elif "purchaser" in self.txt.lower():
                    tenantindex=self.txt.lower().index("vendor")
                else:
                    raise Exception('no mention!')
          
                if abs(tenantindex-entityindex)< abs(landlordindex-entityindex):
                    
                    tenant=ponestring
                    landlord=ptwostring
                else:
                    tenant=ptwostring
                    landlord =ponestring
            except:
                tenant=ptwostring
                landlord = ponestring
            return landlord, tenant

    def return_contract(self):

        return self.txt


    def sum_payment(self):
        if re.findall("monthly|per month",self.txt) !=[]:
                sums=[]
                expr= re.findall("monthly|per month",self.txt)

                for e in expr:
                    eind=self.txt.lower().index(e.lower())
                    sums+=re.findall("\d+ *\, *\d+\$*",self.txt[eind-35:eind+35])
                if sums==[]:
                    for e in expr:
                        eind=self.txt.lower().index(e.lower())
                        sums+=re.findall("\d+ *\,* *\d+\$*",self.txt[eind-35:eind+35])
                if sums==[]:
                    sums.append('0')
                self.sum = sums[0]
                self.contract_type="monthly"
                return int(sums[0].replace(' ','').replace('$','').replace(',','')),"monthly"
        elif re.findall("weekly|per week",self.txt) !=[]:
                sums=[]
                expr= re.findall("weekly|per week",self.txt)

                for e in expr:
                    eind=self.txt.lower().index(e.lower())
                    sums+=re.findall("\d+ *\, *\d+\$*",self.txt[eind-35:eind+35])

                if sums==[]:
                    for e in expr:
                        eind=self.txt.lower().index(e.lower())
                        sums+=re.findall("\d+ *\,* *\d+\$*",self.txt[eind-35:eind+35])
                if sums==[]:
                    sums.append('0')
                self.sum = sums[0]
                self.contract_type="weekly"
                return int(sums[0].replace(' ','').replace('$','').replace(',','')),"weekly"
        else:
            self.contract_type="one-time"

            sums= re.findall("\d+ *\, *\d+\$*",self.txt)
            if sums==[]:
                sums= re.findall("\d+ *\,* *\d+\$*",self.txt)
            if sums==[]:
                sums=["0"]
            self.sum = int(sums[0].replace(' ','').replace('$','').replace(',',''))
            return self.sum,"one-time"
        
    def find_deposit(self):
        sums=re.findall("\d+ *\, *\d+\$*",self.txt)
        deposit=0

        for s in sums:

            ind = self.txt.index(s)

            if "deposit" in self.txt[ind-35:ind+35].lower() and len(s)>4 and int(s.replace(" ","").replace(",","").replace("$","")) > int(self.sum.replace(" ","").replace(",","").replace("$","")):
            
                deposit = int(s.replace(' ','').replace('$','').replace(',',''))
                break
        return deposit
      
    def get_nes(self):
        text = Text(self.txt)
        print text.entities
        return text.entities
        
    def tidy_up(self):
        shutil.rmtree(self.tif_dir)
        shutil.rmtree(self.txt_dir)
        
