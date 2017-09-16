#!/usr/bin/env python
# -*- coding: utf-8 -*-

from parser import Parser
import sys

pdf = sys.argv[1]


P = Parser(pdf)
P.convert_to_tif()
P.tesseract()
P.read_txt()
ners=P.get_nes()
landlord,tenant= P.extract_parties(ners)
print tenant+" is the tenant"
print landlord+" is the landlord"
sumofpayment,frequency= P.sum_payment()
print "the "+frequency+" payment is/are "+sumofpayment
if type =="rental":
    deposit = P.find_deposit()
    print "the deposit is "+deposit
    
P.return_contract()
text=P.return_contract()
P.tidy_up()
