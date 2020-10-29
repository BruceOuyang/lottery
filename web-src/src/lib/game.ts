
interface IUser {
    id: number
}

// 单个用户数据体
class GameBlock {
    public x: number
    public y: number
    public vx: number
    public vy: number
    public bg: string
    public data: IUser
    public id: number
    public g: number

    public targetX: number = 0
    public targetY: number = 0

    public degrees: number

    constructor(x: number, y: number, vx: number, vy: number, bg: string, data: IUser) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.bg = this.getRandomColor();
        this.data = data;
        this.id = data.id;
        this.g = (Math.random() * 5 + 0.1) / 100
        this.degrees = 0
    }
    // 测试使用
    private color = ["#0052cc", "#cb22e5", "#8ee524", "#7de89d", "#fcd58d", "#db85d5", "#e2a878", "#239bba", "#e542f7"]
    private getRandomColor(): string {
        return this.color[Math.floor(Math.random() * this.color.length)]
    }
}

interface IGameSettings {
    countOfItemInRunningAtAnyTime: number // 初始运动的个数
    newCountPeerSecond: number // 每秒新增的元素个数
    pickCountList: Array<number>
    asserts: Map<string, HTMLImageElement>
}


class EndAnimation {
    private fixedBlock: Map<number, GameBlock>
    private canvas: HTMLCanvasElement
    private itemWidth: number
    private itemHeight: number
    private asserts: Map<string, HTMLImageElement>
    constructor(canvas: HTMLCanvasElement, fixedBlockMap: Map<number, GameBlock>, setting: { width: number, height: number, asserts: Map<string, HTMLImageElement> }) {
        this.itemWidth = setting.width
        this.itemHeight = setting.height
        this.fixedBlock = fixedBlockMap
        this.asserts = setting.asserts
        this.canvas = canvas
        this.calculateFixedBlockRunParms()
        this.run()
    }
    private hasStopBlock: Array<GameBlock> = []
    // 计算目标位置，设置目标地址和vx,vy
    private calculateFixedBlockRunParms() {
        // 按50FPS算
        const fps = 50
        // 动画总共运行3秒
        const runTime = 1

        // 每行摆10个
        let columnCount = 10
        // 每个头像间的间隔
        let marginX = 10
        let marginY = 10
        let totalSize = this.fixedBlock.size
        let addRow = totalSize % columnCount === 0 ? 0 : 1
        let rowCount = Math.floor(totalSize / columnCount) + addRow


        let startX = (this.canvas.width - (this.itemWidth + marginX) * columnCount) / 2
        let startY = (this.canvas.height - (this.itemHeight + marginY) * rowCount) / 2


        let i = 0

        const keys = this.fixedBlock.keys()
        for (let key of keys) {

            let item = this.fixedBlock.get(key)

            // 该元素位于第几行
            let currentRowIndex = Math.floor(i / columnCount)
            // 设置元素 的目标位置
            item.targetX = startX + i * (this.itemWidth + marginX)
            item.targetY = startY + currentRowIndex * (this.itemWidth + marginX)

            item.vx = (item.targetX - item.x) / (fps * runTime)
            item.vy = (item.targetY - item.y) / (fps * runTime)
            i++

        }


    }

    private draw() {
        const ctx = this.canvas.getContext("2d")
        const keys = this.fixedBlock.keys()
        for (let key of keys) {
            let item = this.fixedBlock.get(key)
            if (!item) {
                continue
            }
            // 元素已到达目标地址
            // 更新位置
            item.y += item.vy
            item.x += item.vx
            item.degrees = item.degrees + Math.PI * 2 / 60
            if (item.degrees > Math.PI * 2) {
                item.degrees = item.degrees - Math.PI * 2
            }
            if (item.vx > 0) {
                if (item.x >= item.targetX) {
                    item.x = item.targetX
                    item.vx = 0
                }
            } else if (item.vx < 0) {
                if (item.x <= item.targetX) {
                    item.x = item.targetX
                    item.vx = 0
                }
            }
            if (item.vy > 0) {
                if (item.y >= item.targetY) {
                    item.y = item.targetY
                    item.vy = 0
                }
            } else if (item.vy < 0) {
                if (item.y <= item.targetY) {
                    item.y = item.targetY
                    item.vy = 0
                }
            }
            if (item.vy === 0 && item.vx === 0) {
                this.fixedBlock.delete(key)
                this.hasStopBlock.push(item)
            } else {
                // 画头像
                const demo = this.asserts.get("demo")
                ctx.drawImage(demo, 0, 0, demo.width, demo.height, item.x + this.itemWidth / 4, item.y + this.itemHeight / 4, this.itemWidth / 2, this.itemHeight / 2)

                ctx.save()
                // 移动原点中心位置
                ctx.translate(item.x + this.itemWidth / 2, item.y + this.itemWidth / 2)
                // 旋转
                ctx.rotate(item.degrees)

                const itemBg = this.asserts.get("itemBg")
                ctx.drawImage(itemBg, 0, 0, itemBg.width, itemBg.height, -1 * this.itemWidth / 2, -1 * this.itemWidth / 2, this.itemWidth, this.itemHeight)
                ctx.restore()
            }



        }
        // ** img 规定要使用的图像、画布或视频。
        // ** sx 可选。开始剪切的 x 坐标位置。
        // ** sy 可选。开始剪切的 y 坐标位置。
        // ** swidth 可选。被剪切图像的宽度。
        // ** sheight 可选。被剪切图像的高度。
        // ** x 在画布上放置图像的 x 坐标位置。
        // ** y 在画布上放置图像的 y 坐标位置。
        // ** width 可选。要使用的图像的宽度。（伸展或缩小图像）
        // ** height 可选。要使用的图像的高度。（伸展或缩小图像）
        // 绘制已经停止的元素
        this.hasStopBlock.forEach((item) => {
            item.degrees = item.degrees + Math.PI * 2 / 60
            if (item.degrees > Math.PI * 2) {
                item.degrees = item.degrees - Math.PI * 2
            }
            // 画头像
            const demo = this.asserts.get("demo")
            ctx.drawImage(demo, 0, 0, demo.width, demo.height, item.x + this.itemWidth / 4, item.y + this.itemHeight / 4, this.itemWidth / 2, this.itemHeight / 2)
            // 画遮罩
            ctx.save()
            // 移动原点
            ctx.translate(item.x + this.itemWidth / 2, item.y + this.itemWidth / 2)
            // 旋转
            ctx.rotate(item.degrees)
            const itemBg = this.asserts.get("itemBg")
            ctx.drawImage(itemBg, 0, 0, itemBg.width, itemBg.height, -1 * this.itemWidth / 2, -1 * this.itemWidth / 2, this.itemWidth, this.itemHeight)

            ctx.restore()
        })
    }
    // 将选择的对象，排列规则
    private run() {
        const ctx = this.canvas.getContext("2d")
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.draw()
        requestAnimationFrame(() => {
            // if (this.fixedBlock.size === 0) {
            //     return
            // }
            this.run()
        })


    }
}

export class GameScreen {
    private stopped: boolean = false;
    private itemWidth: number = 80 // 每个元素宽度
    private itemHeight: number = 80 // 每个元素高度
    private countOfItemInRunningAtAnyTime: number = 20 // 初始运动的个数
    private newCountPeerSecond = 15 // 每秒新增的元素个数
    private canvas: HTMLCanvasElement
    private runningStore: Map<number, GameBlock> = new Map<number, GameBlock>()//  存储当前运动的元素
    private preparePool: Array<GameBlock> = []
    private pickCountList: Array<number> = []
    private asserts: Map<string, HTMLImageElement> = new Map<string, HTMLImageElement>()
    constructor(canvas: HTMLCanvasElement, userList: Array<IUser>, setting: IGameSettings) {
        this.canvas = canvas

        this.countOfItemInRunningAtAnyTime = setting.countOfItemInRunningAtAnyTime
        this.newCountPeerSecond = setting.newCountPeerSecond
        this.pickCountList = setting.pickCountList
        this.asserts = setting.asserts
        this.initUserPool(userList)
    }
    // 加载资源
    async loadAsserts() {
        new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function () {
                return resolve()
            }
            img.src = '../../Content/images/mayday.jpg';
        })

    }


    // 打乱数组 洗牌
    private shuffle(list: Array<any>) {
        var m = list.length
        var t, i: any;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = list[m];
            list[m] = list[i];
            list[i] = t;
        }
        return list;
    }

    private initUserPool(userList: Array<IUser>) {
        // 打乱数组
        userList = this.shuffle(userList)
        // 初速度
        const initVy = Math.floor(Math.random() * 10)
        for (let i = 0; i < userList.length; i++) {
            // 位置随机
            let x = Math.floor((this.canvas.width - this.itemWidth) * Math.random())
            this.preparePool.push(new GameBlock(x, 0 - this.itemHeight, 0, initVy, "", userList[i]))
        }
    }
    // 选出初始状态的运动元素
    private pickInitRunItems() {

        // 运动数量小于总数
        if (this.countOfItemInRunningAtAnyTime < this.preparePool.length) {
            let i = 0
            while (i < this.countOfItemInRunningAtAnyTime) {
                if (this.preparePool.length === 0) {
                    break
                }
                let item = this.preparePool.shift()
                if (!item) {
                    continue
                }
                this.runningStore.set(item.id, item)
                i++
            }
        } else {
            // 运动数量小于总数
            this.preparePool.forEach((item) => {
                this.runningStore.set(item.id, item)
            })
            this.preparePool = []
        }
    }
    private addNewItemAtTime: number = 0
    start() {
        this.pickInitRunItems()
        this.addNewItemAtTime = Date.now()
        this.animation(Date.now())
    }
    // 需要固定的元素
    private fixedBlock: Map<number, GameBlock> = new Map<number, GameBlock>()
    stop(): Array<Array<IUser>> {
        this.stopped = true
        // 当前屏幕上的所有元素
        let listOnScreen: Array<GameBlock> = []
        for (let key of this.runningStore.keys()) {
            let item = this.runningStore.get(key)
            if (!item) {
                continue
            }
            // 在屏幕内的元素
            if (item.x > 0 && item.y > 0 && item.y < this.canvas.height) {
                listOnScreen.push(item)
            }
        }
        // 洗牌
        listOnScreen = this.shuffle(listOnScreen)
        // 按顺序选幸运用户
        const luckyUserList: Array<Array<IUser>> = []

        let start = 0
        for (let i = 0; i < this.pickCountList.length; i++) {
            let list = listOnScreen.slice(start, start + this.pickCountList[i])
            let q: Array<IUser> = []
            list.forEach((item) => {
                // 存储固定元素
                this.fixedBlock.set(item.id, item)
                // 从运动中删除固定元素
                this.runningStore.delete(item.id)

                q.push(item.data)
            })
            luckyUserList.push(q)
            start = this.pickCountList[i]
        }
        return luckyUserList
    }
    // 绘制固定的元素
    private drawFixedItem() {
        const ctx = this.canvas.getContext("2d")
        const keys = this.fixedBlock.keys()
        for (let key of keys) {
            let item = this.fixedBlock.get(key)
            if (!item) { continue }
            item.degrees = item.degrees + Math.PI * 2 / 60
            if (item.degrees > Math.PI * 2) {
                item.degrees = item.degrees - Math.PI * 2
            }
            // 画头像
            const demo = this.asserts.get("demo")
            ctx.drawImage(demo, 0, 0, demo.width, demo.height, item.x + this.itemWidth / 4, item.y + this.itemHeight / 4, this.itemWidth / 2, this.itemHeight / 2)

            ctx.save()
            // 移动原点中心位置
            ctx.translate(item.x + this.itemWidth / 2, item.y + this.itemWidth / 2)
            // 旋转
            ctx.rotate(item.degrees)

            const itemBg = this.asserts.get("itemBg")
            ctx.drawImage(itemBg, 0, 0, itemBg.width, itemBg.height, -1 * this.itemWidth / 2, -1 * this.itemWidth / 2, this.itemWidth, this.itemHeight)
            ctx.restore()
        }
    }

    // 计算每个元素位置，并将它画出来
    private computeEveryItemPositionAndDrawIt(runTimeInterval: number) {
        // 向下加速度【模拟重力】
        const ctx = this.canvas.getContext("2d")
        const keys = this.runningStore.keys()
        for (let key of keys) {
            let item = this.runningStore.get(key)
            if (!item) {
                continue
            }
            // 挑选超出边界的元素，从用户池删除
            // x 轴超出,  因为不计算反弹，那么y只能朝下方超出边界
            if (item.x > this.canvas.width || item.x < 0 - this.itemWidth || item.y > this.canvas.height) {
                this.runningStore.delete(key)
                // 重置x, y位置, vy速度
                item.x = Math.floor((this.canvas.width - this.itemWidth) * Math.random())
                item.y = 0 - this.itemHeight
                item.vy = Math.floor(Math.random() * 3)
                item.degrees = 0
                // 移除去等元素重新加入待选取池
                this.preparePool.push(item)

                continue
            }
            // 画头像
            const demo = this.asserts.get("demo")
            ctx.drawImage(demo, 0, 0, demo.width, demo.height, item.x + this.itemWidth / 4, item.y + this.itemHeight / 4, this.itemWidth / 2, this.itemHeight / 2)

            ctx.save()
            // 移动原点中心位置
            ctx.translate(item.x + this.itemWidth / 2, item.y + this.itemWidth / 2)
            // 旋转
            ctx.rotate(item.degrees)

            const itemBg = this.asserts.get("itemBg")
            ctx.drawImage(itemBg, 0, 0, itemBg.width, itemBg.height, -1 * this.itemWidth / 2, -1 * this.itemWidth / 2, this.itemWidth, this.itemHeight)
            ctx.restore()

            // 更新位置
            item.y += item.vy
            item.x += item.vx
            item.vy += item.g * runTimeInterval;
            item.degrees = item.degrees + Math.PI * 2 / 60
            if (item.degrees > Math.PI * 2) {
                item.degrees = item.degrees - Math.PI * 2
            }
            // this.runningStore.set(item.id, item)
        }

        // 如果动画已经停止了，那么不再补充新元素
        if (this.stopped) {
            this.drawFixedItem()
            return
        }

        // 那么补充新元素
        if (Date.now() - this.addNewItemAtTime < 200 + Math.random() * 800) {
            return
        }

        // TODO 根据流畅度 考虑剩下等元素是否要重新洗牌，或者某个概率下进行洗牌
        this.preparePool = this.shuffle(this.preparePool)

        this.addNewItemAtTime = Date.now()

        let needAddNewItem = this.newCountPeerSecond
        if (needAddNewItem >= this.preparePool.length) {
            // 剩余小于应新加新元素个数
            this.preparePool.forEach((item) => {
                this.runningStore.set(item.id, item)
            })
            this.preparePool = []
            return
        }
        while (needAddNewItem > 0) {
            let item = this.preparePool.shift()
            this.runningStore.set(item.id, item)
            needAddNewItem--
        }
    }
    // 运动中
    private animation(lastTime: number) {
        //  this.removeOutScreenAndFillFullUserPool(runningStore)
        const ctx = this.canvas.getContext("2d")
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // 运动时长
        const now = Date.now()
        const runTimeInterval = now - lastTime

        this.computeEveryItemPositionAndDrawIt(runTimeInterval)
        requestAnimationFrame(() => {
            if (this.runningStore.size === 0) {
                new EndAnimation(this.canvas, this.fixedBlock, { width: this.itemWidth, height: this.itemHeight, asserts: this.asserts })
                return
            }
            this.animation(now)
        })
    }
}