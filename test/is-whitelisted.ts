import tap from 'tap'
import { makeWhitelistTest } from '../src/relative-protocol-whitelist'

const isWhitelisted = makeWhitelistTest(['a.com', 'b.com', 'c.com'])

tap.equal(isWhitelisted('//a.com/images/hello.jpg'), true)
tap.equal(isWhitelisted('https://b.com/images/hello.jpg'), false)
tap.equal(isWhitelisted('http://c.com/images/hello.jpg'), false)
tap.equal(isWhitelisted('//d.com/images/hello.jpg'), false)