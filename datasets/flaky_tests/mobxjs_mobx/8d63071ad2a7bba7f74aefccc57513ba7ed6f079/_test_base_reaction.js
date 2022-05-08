// https://github.com/mobxjs/mobx/blob/8d63071ad2a7bba7f74aefccc57513ba7ed6f079/test/base/reaction.js 

// blob: 8d63071ad2a7bba7f74aefccc57513ba7ed6f079 

// project_name: mobxjs/mobx 

// flaky_file: /test/base/reaction.js 

// test_affected: https://github.com/mobxjs/mobx/blob/8d63071ad2a7bba7f74aefccc57513ba7ed6f079/test/base/reaction.js 
// start_line: 66 
// end_line: 107 
test("effect debounce is honored", () => {
    expect.assertions(2)

    return new Promise((resolve, reject) => {
        var a = mobx.observable.box(1)
        var values = []
        var exprCount = 0

        var d = reaction(
            () => {
                exprCount++
                return a.get()
            },
            newValue => {
                values.push(newValue)
            },
            {
                delay: 150,
                fireImmediately: false
            }
        )

        setTimeout(() => a.set(2), 40)
        setTimeout(() => a.set(3), 300) // should not be visible, combined with the next
        setTimeout(() => a.set(4), 301)
        setTimeout(() => a.set(5), 600)
        setTimeout(() => {
            d()
            a.set(6)
        }, 1000)

        setTimeout(() => {
            try {
                expect(values).toEqual([2, 4, 5])
                expect(exprCount).toBe(4)
                resolve()
            } catch (e) {
                reject(e)
            }
        }, 1200)
    })
})
