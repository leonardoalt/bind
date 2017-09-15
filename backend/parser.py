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
import subprocess
import configparser
import json
from parser import HOCRDocument

class Parser:

    def __init__(self,pdf_path,ctype):
        self.pdf_path = pdf_path
        self.contract_type=ctype

    def convert_to_tif(self):
        try:
            os.system("mkdir "+self.tif_dir)
            p_convert = subprocess.Popen(["convert", "-density","300","-alpha","Off" , self.pdf_path, self.tif_dir+"page_%04d.tif"])
            out, error = p_convert.communicate()
            return True
        except Exception as es:
            print str(es)
            return False
        
    def tesseract(self):
        try:
            os.system("mkdir "+self.hocr_dir_ori)
            os.system("mkdir "+self.hocr_dir)
            os.system("mkdir results/"+self.pdf[:-4]+'/tess-txt/')
            for page in os.listdir(self.tif_dir.replace("\\"," ")):
                p = subprocess.Popen(["tesseract","-l",self.font,self.tif_dir+'/'+page,self.hocr_dir_ori+page[:-4],'txt'])
                out,error = p.communicate()
            return True
        except Exception as es:
            print str(es)
            return False
            
    def extract_party_a(self):
        pass
       
    def extract_party_b(self):
        pass
