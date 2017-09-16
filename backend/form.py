#!/usr/bin/env python
# encoding: utf-8

# pythonspot.com
import sys
import time
sys.path.append('.')
from flask import Flask, request,  jsonify
from werkzeug.utils import secure_filename
from parser import Parser
from multiprocessing import Pool






app = Flask(__name__)
app.secret_key = 'key'
app.config["APPLICATION_ROOT"] = "localhost:8080"



def run_ocr(pdf_store):
    try:
        
            
        pipe = Parser(pdf_store)
        exitstat= pipe.convert_to_tif()
        if exitstat:
            exitstat=pipe.tesseract()
            if exitstat:
                pipe.read_txt()
                ners=pipe.get_nes()
                landlord,tenant= pipe.extract_parties(ners)
                sumofpayment,frequency= pipe.sum_payment()
                print "the payment are "+sumofpayment
                if frequency =="monthly" or frequency=="weekly":
                    deposit = pipe.find_deposit()
                else:
                    deposit=''
                text=pipe.return_contract()
                pipe.tidy_up()
                return {"sum":sumofpayment,"frequency":frequency,"deposit": deposit, "sender":tenant,"receiver":landlord,"description":text}
    except Exception as e:
        print "error!"
        print e
            

@app.route("/parse_contract", methods=['POST'])
def hello():

    f = request.files['scan']

            #f= request.files['file']
    if f.filename[-3:].lower() in ["jpg","pdf","tif","png"]:
        print "file is " + f.filename
        filename = secure_filename(f.filename)
        #scan=request.files['scan']
        pdf_store="scans/"+filename
        f.save(pdf_store)
        if pdf_store!="scans/":
            try:
            #correction here

                pool = Pool(processes=1)
                result = pool.apply_async(run_ocr,(pdf_store,))
                json=result.get()
                return jsonify(json)
                   
            except Exception as es:
                print "EXCEPTION IS " + es
                sys.exit()


                
    

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=50001)
