import router from '@ohos.router'
import { storeCaffeine } from '../../common/utils/storageManager'

export default {
    onInit() {
        console.info('AddCaffeine page loaded')
    },

    goBack() {
        router.replace({
            uri: 'pages/index/index'
        })
    },

    goCustom() {
        router.replace({
            uri: 'pages/customCaffeine/customCaffeine'
        })
    },

    addEspresso() {
        this.addCaffeineAmount(80)
    },
    addLatte() {
        this.addCaffeineAmount(120)
    },
    addAmericano() {
        this.addCaffeineAmount(95)
    },
    addCappuccino() {
        this.addCaffeineAmount(110)
    },

    addCaffeineAmount(amount) {
        storeCaffeine(amount, (success) => {
            if (success) {
                console.info(`Added ${amount}mg caffeine.`)
                router.replace({
                    uri: 'pages/index/index'
                })
            } else {
                console.error('Failed to store caffeine.')
            }
        })
    }
}
