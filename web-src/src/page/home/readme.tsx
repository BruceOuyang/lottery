import React from 'react';
export default class Component extends React.Component {
    genDemo() {
        fetch("/api/setting/demo")
    }
    readConfig() {
        fetch("/api/setting/config").then(() => {
            window.location.reload()
        })
    }
    render() {
        return (<p>
            <p>如果要测试，在数据配置中，先点击生成”测试配置“，然后点击“读取配置数据”</p>
            <p>如果已经在生产环境配置好数据，在数据配置中，点击“读取配置数据”</p>
            <p>抽奖结束后， 按ESC 键退出抽奖， 抽奖进行时按F11进行全屏。 按 空格键 暂停动画开始抽奖</p>
        </p>)
    }
}