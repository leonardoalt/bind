#!/usr/bin/env python
# encoding: utf-8

# pythonspot.com
import sys
import time
sys.path.append('.')
from flask import Flask,Blueprint, render_template, redirect, request, flash, url_for
from flask_wtf import FlaskForm
from wtforms import Form, TextField,TextAreaField, validators, StringField, SubmitField
import flask.ext.login as flask_login
from flask.ext.login import LoginManager, UserMixin 
from flask_wtf.file import FileField, FileRequired, FileAllowed
from werkzeug.utils import secure_filename
import codecs
from werkzeug.datastructures import CombinedMultiDict
from parser import Parser
import subprocess
from multiprocessing import Pool

g_filename = ''
g_email = ''



login_manager = LoginManager()

app = Flask(__name__)
#app.register_blueprint(bp, url_prefix='/ocr')
app.secret_key = 'key'
app.config["APPLICATION_ROOT"] = "localhost:8080"

#login_manager.init_app(app)

#users = {'Zeitsparer':{'pw':'zeitsparen'}}
#         
#class UploadForm(FlaskForm):
#    
#    email = TextField('Email:', validators=[validators.required(), validators.Length(min=6, max=35)])
#    scan = FileField("Scan:", validators=[FileRequired(),  FileAllowed(['jpg', 'png','pdf','tif'], 'Images and PDF only!')])
#    
# 
#class User(UserMixin):
#  pass

#@login_manager.user_loader
#def user_loader(username):
#  if username not in users:
#    return

#  user = User()
#  user.id = username
#  return user

#@login_manager.request_loader
#def request_loader(request):
#  username = request.form.get('username')
#  if username not in users:
#    return

#  user = User()
#  user.id = username

#  user.is_authenticated = request.form['pw'] == users[username]['pw']

#  return user
#  
#@app.route('/', methods=['GET', 'POST'])
#def index():
#    if request.method == 'POST':
#    
#        username = request.form.get('username')
#        if username in users:
#            print "benutzer bekannt"
#            if request.form.get('pw') == users[username]['pw']:
#                print "trying anyway"
#                user = User()
#                user.id = username
#                flask_login.login_user(user)
#                #return redirect(url_for('hello'))
#                return redirect('/ocr/protect')
#            else:
#                print 'pwd incorrect'
#                flash('Das Passwort stimmt nicht!',"error")
#                return redirect('/ocr/')
#        else:
#            print "benutzer unbekannt"
#            flash('Unter diesem Namen ist kein Benutzer bekannt.',"error")
#    return render_template('index.html')  
#  
#@app.route('/success')
#def success():
#    
#    return render_template('success.html')

def run_ocr(pdf_store,ctype):
    try:
        
            
        pipe = Parser(pdf_store,ctype)
        exitstat= pipe.convert_to_tif()
        if exitstat:
            exitstat=pipe.tesseract()
            if exitstat:
                pipe.read_txt()
                ners=pipe.get_nes()
                landlord,tenant= pipe.extract_parties(ners)
                sumofpayment= pipe.sum_payment()
                print "the payment are "+sumofpayment
                if type =="rental":
                    deposit = pipe.find_deposit()
                text=pipe.return_contract()
                pipe.tidy_up()
    except Exception as e:
        print "error!"
        print e
            




@app.route("/#/new_contract", methods=['GET', 'POST'])
@flask_login.login_required
def hello():
    #form = ReusableForm(request.form)
    form = UploadForm(CombinedMultiDict((request.files, request.form)))
    print form
    if request.method == 'POST':
        #if form.validate_on_submit():
            #email=request.form['email']
            #script=request.form["script"]
            
            #print "email is " + email
            #print script
            f = request.files['pdf']
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
                        pool.apply_async(run_ocr,(pdf_store,))
                        

                    except Exception as es:
                        print "EXCEPTION IS " + es
                        sys.exit()

                #return redirect('/ocr/success')
               
#            else:
#                flash('Error. Bist Du sicher, dass Deine Datei entweder pdf, jpg, tif oder png ist?')
 
    return render_template('hello.html', form=form)
    

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=50001)
