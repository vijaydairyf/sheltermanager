#!/usr/bin/python

"""
Implements a python disk cache in a similar way to memcache,
uses md5sums of the key as filenames.
"""

import al
import cPickle as pickle
import hashlib
import os
import time
from sitedefs import DISK_CACHE

def _getfilename(key):
    """
    Calculates the filename from the key
    (md5 hash)
    """
    m = hashlib.md5()
    m.update(key)
    fname = "%s/%s" % (DISK_CACHE, m.hexdigest())
    return fname

def delete(key):
    """
    Removes a value from our disk cache.
    """
    try:
        fname = _getfilename(key)
        os.unlink(fname)
    except Exception,err:
        al.error(str(err), "cachedisk.delete")

def get(key):
    """
    Retrieves a value from our disk cache. Returns None if the
    value is not found or has expired.
    """
    try:
        fname = _getfilename(key)
        
        # No cache entry found, bail
        if not os.path.exists(fname): return None

        # Pull the entry out
        f = open(fname, "r")
        o = pickle.load(f)
        f.close()

        # Has the entry expired?
        if o["expires"] < int(time.time()):
            delete(key)
            return None

        return o["value"]
    except Exception,err:
        al.error(str(err), "cachedisk.get")
        return None

def put(key, value, ttl):
    """
    Stores a value in our disk cache with a time to live of ttl. The value
    will be removed if it is accessed past the ttl.
    """
    try:
        fname = _getfilename(key)

        o = {
            "expires": int(time.time()) + ttl,
            "value": value
        }

        # Write the entry
        f = open(fname, "w")
        pickle.dump(o, f)
        f.close()

    except Exception,err:
        al.error(str(err), "cachedisk.put")


