<template>
  <div id="bill">
    <div class="bill-row">
      <div class="bill-list-wrapper">
        <h2>收支表</h2>
        <ul class="bill-list">
          <li>
            <div class="item-left">
              <strong>今天</strong>
              <p>2017年11月27日</p>
            </div>
            <div class="item-right">
              <span>0.00</span><br/>
              <span>0.00</span>
            </div>
          </li>
          <li>
            <div class="item-left">
              <strong>本周</strong>
              <p>11月27日-12月3日</p>
            </div>
            <div class="item-right">
              <span>0.00</span><br/>
              <span>0.00</span>
            </div>
          </li>
          <li>
            <div class="item-left">
              <strong>本月</strong>
              <p>11月1日-11月30日</p>
            </div>
            <div class="item-right">
              <span>0.00</span><br/>
              <span>0.00</span>
            </div>
          </li>
          <li>
            <div class="item-left">
              <strong>今年</strong>
              <p>2017年</p>
            </div>
            <div class="item-right">
              <span>0.00</span><br/>
              <span>0.00</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="bill-statistic">
        <div class="bs-head">
          <label>本月收支统计图</label>
        </div>
        <chart :options="pie"></chart>
      </div>
    </div>
    <div class="bill-row">
      <div class="bill-comparison">
        <div class="bc-head">
          <label>本月收支统计图</label>
        </div>
        <chart :options="bar"></chart>
      </div>
    </div>
  </div>
</template>
<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
export default {
  name: 'bill',
  components: { 'chart': ECharts },
  data() {
    return {
      pie: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: [
              {value: 335, name: '直接访问'},
              {value: 310, name: '邮件营销'},
              {value: 234, name: '联盟广告'},
              {value: 135, name: '视频广告'},
              {value: 1548, name: '搜索引擎'}
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      bar: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
          }
        },
        legend: {
            data: ['蒸发量', '降水量']
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '水量',
            min: 0,
            max: 250,
            interval: 50,
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '蒸发量',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
          },
          {
            name: '降水量',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
          }
        ]
      }
    }
  }
}
</script>
<style lang="stylus">
#bill
  .bill-row:nth-child(1)
    display flex
    margin 0 0 20px 0
  .bill-list-wrapper
    display inline-block
    border 1px solid #ededed
    padding 0 4px
    background-color #F8F8F8
    vertical-align top
    box-shadow 0 0 8px 2px #999
    h2
      height 40px
      line-height 40px
      font-size 15px
      padding 0 5px
      color #FF5C0C
    .bill-list
      li
        width 250px
        display flex
        height: 50px;
        border-top: 1px dashed #E3E3E3;
        padding: 8px 5px 0 5px;
        line-height 20px
        .item-left
          flex 1
        .item-right
          span
            &:nth-of-type(1)
              color #cb3535
            &:nth-of-type(2)
              color #819539
  .bill-statistic
    display inline-block
    background-color #F8F8F8
    box-shadow 0 0 8px 2px #999
    flex 1
    padding 0 4px
    margin 0 0 0 20px
    .bs-head
      height 40px
      line-height 40px
      color #FF5C0C
      font-size 15px
      border-bottom 1px dashed #E3E3E3
      padding: 0 5px
      label
        font-weight bold
    .echarts
      width 360px
      height 240px
  .bill-comparison
    background-color #F8F8F8
    box-shadow 0 0 8px 2px #999
    padding 0 4px
    .bc-head
      height 40px
      line-height 40px
      color #FF5C0C
      font-size 15px
      border-bottom 1px dashed #E3E3E3
      padding: 0 5px
      label
        font-weight bold
    .echarts
      width 100%
      height 400px

</style>
