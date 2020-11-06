const commands = [
    {
        value: 'character',
        label: 'CHAR',
        fields: [ 'realm', 'character' ],
    },
    {
        value: 'guild',
        label: 'GUILD',
        fields: [ 'realm', 'guild' ],
    },
    {
        value: 'find',
        label: 'FIND',
        fields: [ 'type', 'match' ],
    },
    {
        value: 'item',
        label: 'ITEM',
        fields: [ 'realm', 'item' ],
    },
    {
        value: 'wowtoken',
        label: 'WOWTOKEN',
        fields: [ 'realm' ],
    },
    {
        value: 'contract',
        label: 'CONTRACT',
        fields: [ 'realm', 'item', 'contract_tenor' ],
    },
    {
        value: 'xrs',
        label: 'XRS',
        fields: [ 'item' ],
    },
    {
        value: 'realmsinfo',
        label: 'REALMSINFO',
        fields: [ 'realmsinfo' ],
    },
]

const type = [
    {
        value: 'a',
        label: 'A',
    },
    {
        value: 'b',
        label: 'B',
    },
    {
        value: 'c',
        label: 'C',
    },
    {
        value: 'any',
        label: 'ANY',
    },
    {
        value: 'all',
        label: 'ALL',
    },
]

const realmsinfo = [
    {
        value: 'Europe',
        label: 'EU',
    },
    {
        value: 'en_GB',
        label: 'EN',
    },
    {
        value: 'de_DE',
        label: 'DE',
    },
    {
        value: 'fr_FR',
        label: 'FR',
    },
    {
        value: 'ru_RU',
        label: 'RU',
    },
    {
        value: 'es_ES',
        label: 'ES',
    },
    {
        value: 'it_IT',
        label: 'IT',
    },
]

const tenors = [
    {
        value: 'tod',
        label: 'TOD',
    },
    {
        value: 'ytd',
        label: 'YTD',
    },
    {
        value: 'week',
        label: 'WEEK',
    },
    {
        value: 'last_week',
        label: 'WEEK-1',
    },
    {
        value: 'month',
        label: 'MONTH',
    },
    {
        value: 'last_month',
        label: 'MONTH-1',
    },
]

export { commands, type, realmsinfo, tenors }
