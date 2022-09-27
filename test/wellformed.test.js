
import {beforeEach, describe, expect, it, vi, test} from 'vitest';
import questions from '../src/routes/automaths/questions'
import generate from '../src/routes/automaths/generateQuestion'

describe("testing generate question doesn't throw exception", () => {

    // console.log(questions.questions)
    const t = []
    const qs = questions.questions
    // jest.spyOn(window.localStorage.__proto__, 'setItem');

    Object.getOwnPropertyNames(qs).forEach(theme => {
        Object.getOwnPropertyNames(qs[theme]).forEach(domain => {
            Object.getOwnPropertyNames(qs[theme][domain])
                .forEach(subdomain => {
                    qs[theme][domain][subdomain].forEach((q, level) => {
                        // console.log(`${theme}-${domain}-${subdomain}-${level}`)
                        t.push([theme, domain, subdomain, level])
                    })
                })
        })
    })




    test.each(t)('%s - %s - %s - %s', async (theme, domain, subdomain, level) => {
        const q = qs[theme][domain][subdomain][level]
        let generated
        const promises = []
        expect(() => {
            generated = generate(q)
        }).not.toThrow()

        if (generated.imageBase64P) promises.push(generated.imageBase64P)
        if (generated.imageCorrectionBase64P) promises.push(generated.imageCorrectionBase64P)

        if (generated.choices) {
            generated.choices.forEach(choice => {
                if (choice.imageBase64P) promises.push(choice.imageBase64P)
            })
        }
        if (promises.length) {
            // console.log('promises', promises)
            const result = await Promise.all(promises)
            // console.log('promises resolved', result)
        }
    })
})
