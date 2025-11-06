import router from '@system.router'
import { storeCaffeine } from '../../common/utils/storageManager'


export default {
    data: {
        caffeine: 100
    },

    onInit() {
    },

    // Navigation
    goBack() {
        router.replace({
            uri: 'pages/addCaffeine/addCaffeine'
        })
    },

    increaseCaffeine() {
        this.caffeine += 10
        this.$apply()
    },
    decreaseCaffeine() {
        if (this.caffeine > 0) this.caffeine -= 10
        this.$apply()
    },

    addCaffeine() {
        storeCaffeine(this.caffeine, (success) => {
            if (success) {
                console.log(`Added ${this.caffeine} mg caffeine.`)
                router.replace({
                    uri: 'pages/index/index'
                })
            } else {
                console.error('Failed to store caffeine.')
            }
        })
    }
}
