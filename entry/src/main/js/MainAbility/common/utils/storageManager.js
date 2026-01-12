import storage from '@system.storage'

const PREFERENCE_PREFIX = 'caffeine_usage_' // Key prefix for stored days
const MAX_DAYS = 7 // Keep only last 7 days

function getDateKey(date) {
    return date.toISOString().slice(0, 10)
}

// Read a value from storage
function getValue(key, defaultValue, callback) {
    storage.get({
        key: key,
        success: function (data) {
            const value = parseInt(data) || defaultValue
            callback(value)
        },
        fail: function () {
            callback(defaultValue)
        }
    })
}

// Write a value to storage
function setValue(key, value, callback) {
    storage.set({
        key: key,
        value: String(value),
        success: function () {
            if (callback) {
                callback(true)
            }
        },
        fail: function () {
            if (callback) {
                callback(false)
            }
        }
    })
}

// Delete a value from storage
function deleteValue(key, callback) {
    storage.delete({
        key: key,
        success: function () {
            if (callback) {
                callback(true)
            }
        },
        fail: function () {
            if (callback) {
                callback(false)
            }
        }
    })
}

// Get last 7 days of caffeine data
export function getLast7Days(callback) {
    const today = new Date()
    let result = []
    let remaining = MAX_DAYS

    for (let i = MAX_DAYS - 1; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)
        const key = PREFERENCE_PREFIX + getDateKey(d)

        getValue(key, 0, (value) => {
            result.push(value)
            remaining--

            if (remaining === 0) {
                callback(result)
            }
        })
    }
}

// Store today's caffeine amount and clean old data
export function storeCaffeine(amount, callback) {

    const today = new Date()
    const todayKey = PREFERENCE_PREFIX + getDateKey(today)

    getValue(todayKey, 0, (currentValue) => {
        const newValue = currentValue + amount
        setValue(todayKey, newValue, (ok) => {
            if (ok) {
                cleanupOldData(today, () => {
                    if (callback) {
                        callback(true)
                    }
                })
            } else {
                if (callback) {
                    callback(false)
                }
            }
        })
    })
}

// Remove records older than MAX_DAYS
function cleanupOldData(today, callback) {
    for (let i = MAX_DAYS; i < 50; i++) {
        // Just a safety range: only check up to 50 days back
        const oldDate = new Date(today)
        oldDate.setDate(today.getDate() - i - 7)
        const key = PREFERENCE_PREFIX + getDateKey(oldDate)

        deleteValue(key)
    }
    if (callback) {
        callback()
    }
}
