#!/usr/bin/env python
# -*- coding: utf-8 -*-

from parser import Parser
import sys

pdf = sys.argv[1]
type="unique"

P = Parser(pdf,type)
P.convert_to_tif()
P.tesseract()
P.read_txt()
ners=P.get_nes()
landlord,tenant= P.extract_parties(ners)
sumofpayment= P.sum_payment()
print "the payment are "+sumofpayment
if type =="rental":
    deposit = P.find_deposit()
text=P.return_contract()
P.tidy_up()
