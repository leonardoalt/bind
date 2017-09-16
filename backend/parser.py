#!/usr/bin/env python
# -*- coding: utf-8 -*-
import magic
# Import smtplib for the actual sending function
import smtplib
# Import the email modules we'll need
from email.mime.text import MIMEText
import sys
import re
import urllib2
import re
import os
import codecs
import shutil
import subprocess
import configparser
import json
from polyglot.text import Text


class Parser:

    def __init__(self,pdf_path,ctype):
        self.pdf_path = pdf_path
        self.contract_type=ctype
        self.tif_dir = '/'.join(self.pdf_path.split('/')[:-1])+'/tifs'
        self.txt_dir='/'.join(self.pdf_path.split('/')[:-1])+'/txt'
        self.txt=''
        self.sum=''
    
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
            print i
            if re.search(' '.join(pers_tmp[i])+'( +(and|&) +)'+' '.join(pers_tmp[i+1]),self.txt)!=None:
                pers.append(re.search(' '.join(pers_tmp[i])+'( +(and|&) +)'+' '.join(pers_tmp[i+1]),self.txt).group(0))
                i+=1
                lastadded=i
            else:
                pers.append(pers_tmp[i])
            i+=1
        if lastadded !=len(pers_tmp):
            pers.append(pers_tmp[-1])
        print pers
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

        if self.contract_type=="rental":
            try:
                tenantindex=self.txt.lower().index("tenant")
                landlordindex=self.txt.lower().index("landlord")
            
                if abs(tenantindex-entityindex)< abs(landlordindex-entityindex):
                
                    tenant=ponestring
                    landlord=ptwostring
                else:
                    tenant=ptwostring
                    landlord =ponestring
            except:
                tenant=ptwostring
                landlord = ponestring
            print tenant+" is the tenant"
            print landlord+" is the landlord"
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
                    print tenantindex
                    print entityindex
                    print landlordindex
                    
                    tenant=ponestring
                    landlord=ptwostring
                else:
                    tenant=ptwostring
                    landlord =ponestring
            except:
                tenant=ptwostring
                landlord = ponestring
            print tenant+" is the buyer"
            print landlord+" is the seller"
            return landlord, tenant

    def return_contract(self):
        return self.txt


    def sum_payment(self):
        if self.contract_type=="rental":
            sums=[]
            expr= re.findall("month[^ ]*",self.txt)
            print expr
            for e in expr:
                eind=self.txt.lower().index(e.lower())
                sums+=re.findall("\d+ *\, *\d+\$*",self.txt[eind-35:eind+35])
            print sums
            if sums==[]:
                for e in expr:
                    eind=self.txt.lower().index(e.lower())
                    sums+=re.findall("\d+ *\,* *\d+\$*",self.txt[eind-35:eind+35])
            if sums==[]:
                sums.append('0')
            self.sum = sums[0]
            return sums[0]
        elif self.contract_type=="unique":

            sums= re.findall("\d+ *\, *\d+\$*",self.txt)
            if sums==[]:
                sums= re.findall("\d+ *\,* *\d+\$*",self.txt)
            
            self.sum = sums[0]
            return self.sum
        
    def find_deposit(self):
        sums=re.findall("\d+ *\, *\d+\$*",self.txt)
        deposit="0"
        print sums
        for s in sums:

            ind = self.txt.index(s)

            if "deposit" in self.txt[ind-35:ind+35].lower() and len(s)>4 and int(s.replace(" ","").replace(",","").replace("$","")) > int(self.sum.replace(" ","").replace(",","").replace("$","")):
                print s
                print self.sum
                deposit = s
                break
        print "The deposit is "+deposit
        return deposit
      
    def get_nes(self):
        text = Text(self.txt)
        print text.entities
        return text.entities
        
    def tidy_up(self):
        shutil.rmtree(self.tif_dir)
        shutil.rmtree(self.txt_dir)
        
