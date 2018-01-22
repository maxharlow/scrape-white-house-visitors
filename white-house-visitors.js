const Highland = require('highland')
const Request = require('request')
const RetryMe = require('retry-me')
const FS = require('fs')
const CSVWriter = require('csv-write-stream')

const http = Highland.wrapCallback((location, callback) => {
    const input = output => {
        Request(location, (error, response) => {
            const failure = error ? error : (response.statusCode >= 400) ? new Error(response.statusCode) : null
            if (response.statusCode === 404) output(null, Object.assign(response, { body: '[]' })) // hack empty responses
            else output(failure, response)
        })
    }
    RetryMe(input, { factor: 1.5 }, callback)
})

const api = 'https://www.politico.com/interactives/databases/trump-white-house-visitor-logs-and-records/api/'

function setup(response) {
    console.log('Getting metadata...')
    const body = JSON.parse(response.body)
    const dateOrder = (a, b) => new Date(a.date) - new Date(b.date)
    return body.days.sort(dateOrder).map(day => {
        return { url: api + 'date/' + day.date + '.json', date: day.date }
    })
}

function day(response) {
    console.log('Getting data for ' + response.request.date + '...')
    return JSON.parse(response.body).map(visit => {
        return {
            date: visit.date,
            place: visit.place,
            title: visit.visitor.title,
            name: visit.visitor.first_name + (visit.visitor.middle_initial ? ' ' + visit.visitor.middle_initial : '') + ' ' + visit.visitor.last_name,
            type: visit.visitor.type ? visit.visitor.type.name : '',
            organisation: visit.visitor.organization ? visit.visitor.organization.name : '',
            gender: visit.visitor.race,
            race: visit.visitor.race,
            party: visit.visitor.party || '',
            nationality: visit.visitor.nationality || '',
            note: visit.visitor.note || ''
        }
    })
}

Highland([api + 'meta.json'])
    .flatMap(http)
    .flatMap(setup)
    .flatMap(http)
    .flatMap(day)
    .errors(e => console.error(e.stack))
    .through(CSVWriter())
    .pipe(FS.createWriteStream('white-house-visitors.csv'))
