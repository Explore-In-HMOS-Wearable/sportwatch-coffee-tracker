import router from '@system.router'
import { getLast7Days, storeCaffeine } from '../../common/utils/storageManager'

export default {
    data: {
        todayTotal: 0,
        canvasW: 300,
        canvasH: 200
    },
    onShow() {

        this.loadData()
    },
    loadData() {
        getLast7Days((data) => {
            this.caffeineData = data
            console.log(data)
            this.todayTotal = data[data.length - 1]
            //this.$apply() // update UI
            this.drawGraph()
        })
    },
    drawGraph(){
        const el = this.$refs.canvas1;
        const ctx = el.getContext('2d');

        const w = this.canvasW
        const h = this.canvasH
        const data = this.caffeineData

        let maxVal = 1; // default
        for (let i = 0; i < data.length; i++) {
            if (typeof data[i] === 'number' && data[i] > maxVal) {
                maxVal = data[i];
            }
        }
        const stepX = (w - 60) / (data.length - 1)
        const leftSpace = 40
        const rightSpace = 15

        // Draw horizontal grid lines + labels
        const supportLineSize = maxVal == 1 ? 0 : 4

        const spaceSize = (h-60)/supportLineSize

        const fontSize = 12
        for (let i = 0; i < (supportLineSize+1); i++) {
            ctx.strokeStyle = (i === 0) ? '#341100' : '#cfab71'
            const y = h -30 - i * spaceSize
            ctx.beginPath()
            ctx.moveTo(leftSpace, y)
            ctx.lineTo(w - rightSpace, y)
            ctx.stroke()

            const value = Math.round((i / supportLineSize) * maxVal)
            ctx.fillStyle = '#4f351c'
            ctx.font = '12px sans-serif'
            ctx.textAlign = 'right'
            ctx.textBaseline = 'middle'
            ctx.fillText(value.toString(), fontSize + 20, y - fontSize)
        }

        // Plot line
        ctx.strokeStyle = '#4f351c'
        ctx.lineWidth = 2
        ctx.beginPath()
        data.forEach((v, i) => {
            const x = leftSpace + i * stepX
            const y = h - 30 - (v / maxVal) * (h - 60)
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
        })
        ctx.stroke()

        ctx.fillStyle = '#713105'

        data.forEach((v, i) => {
            const x = leftSpace + i * stepX
            const y = h - 30 - (v / maxVal) * (h - 60)
            ctx.beginPath()
            ctx.arc(x, y, 3, 0, Math.PI*2)
            ctx.fill()
            ctx.stroke()
        })
    },
    goAddPage() {
        router.replace({
            uri: 'pages/addCaffeine/addCaffeine'
        })
    }
};
