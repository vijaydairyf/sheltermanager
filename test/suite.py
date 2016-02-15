#!/usr/bin/python env

import unittest
import base
import dbupdate

fullsuite = []

import test_additional
suiteadd = unittest.makeSuite(test_additional.TestAdditional, 'test')
fullsuite.append(suiteadd)

import test_animalcontrol
suiteac = unittest.makeSuite(test_animalcontrol.TestAnimalControl, 'test')
fullsuite.append(suiteac)

import test_animalname
suitean = unittest.makeSuite(test_animalname.TestAnimalName, 'test')
fullsuite.append(suitean)

import test_animal
suitea = unittest.makeSuite(test_animal.TestAnimal, 'test')
fullsuite.append(suitea)

import test_csvimport
suitecsv = unittest.makeSuite(test_csvimport.TestCSVImport, 'test')
fullsuite.append(suitecsv)

import test_dbfs
suitedbfs = unittest.makeSuite(test_dbfs.TestDBFS, 'test')
fullsuite.append(suitedbfs)

import test_diary
suitediary = unittest.makeSuite(test_diary.TestDiary, 'test')
fullsuite.append(suitediary)

import test_financial
suitefin = unittest.makeSuite(test_financial.TestFinancial, 'test')
fullsuite.append(suitefin)

import test_geo
suitegeo = unittest.makeSuite(test_geo.TestGeo, 'test')
fullsuite.append(suitegeo)

import test_html
suitehtml = unittest.makeSuite(test_html.TestHtml, 'test')
fullsuite.append(suitehtml)

import test_log
suitelog = unittest.makeSuite(test_log.TestLog, 'test')
fullsuite.append(suitelog)

import test_lookups
suitelook = unittest.makeSuite(test_lookups.TestLookups, 'test')
fullsuite.append(suitelook)

import test_lostfound
suitelf = unittest.makeSuite(test_lostfound.TestLostFound, 'test')
fullsuite.append(suitelf)

import test_media
suitemed = unittest.makeSuite(test_media.TestMedia, 'test')
fullsuite.append(suitemed)

import test_medical
suitemedi = unittest.makeSuite(test_medical.TestMedical, 'test')
fullsuite.append(suitemedi)

import test_mobile
suitemob = unittest.makeSuite(test_mobile.TestMobile, 'test')
fullsuite.append(suitemob)

import test_movement
suitemove = unittest.makeSuite(test_movement.TestMovement, 'test')
fullsuite.append(suitemove)

import test_person
suiteperson = unittest.makeSuite(test_person.TestPerson, 'test')
fullsuite.append(suiteperson)

import test_publish
suitepublish = unittest.makeSuite(test_publish.TestPublish, 'test')
fullsuite.append(suitepublish)

import test_search
suitesearch = unittest.makeSuite(test_search.TestSearch, 'test')
fullsuite.append(suitesearch)

import test_service
suiteservice = unittest.makeSuite(test_service.TestService, 'test')
fullsuite.append(suiteservice)

import test_stock
suitestock = unittest.makeSuite(test_stock.TestStock, 'test')
fullsuite.append(suitestock)

import test_users
suiteusers = unittest.makeSuite(test_users.TestUsers, 'test')
fullsuite.append(suiteusers)

import test_waitinglist
suitewl = unittest.makeSuite(test_waitinglist.TestWaitingList, 'test')
fullsuite.append(suitewl)

if __name__ == "__main__":
    dbupdate.perform_updates(base.get_dbo())
    s = unittest.TestSuite(fullsuite)
    runner = unittest.TextTestRunner()
    runner.run(s)

