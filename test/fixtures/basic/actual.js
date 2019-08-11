import DevDebugger from 'dev-debugger'

let dbg = new DevDebugger({
    debug: true,
    caseName: 'testInit',
    cases: {
        'testInit': {
            'baseData': 100
        },
        'testEnd': {
            'baseData': 0
        }
    }
})
let base = 3
var data1 = dbg.debugVal(1, 100)
var data2 = dbg.debugVal(function () { return base }, function () { return 3 })
var data3 = dbg.debugVal({ base }, { base: 9 })
var data4 = dbg.debugCaseTag(2, 'baseData')
let _r = dbg.debugVal.bind(dbg)
let _rt = dbg.debugCaseTag.bind(dbg)
var data11 = _r(1, 100)
var data22 = _r(function () { return base }, function () { return 3 })
var data33 = _r({ base }, { base: 9 })
var data44 = _rt(2, 'baseData')
