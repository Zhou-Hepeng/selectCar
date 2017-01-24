import React, { Component, PropTypes } from 'react'
import ShowAlert from '../components/Alert'
import { Tool ,Alert} from '../utils/fetch'

class List extends Component {
  constructor(props) {
        super(props);
        this.RoadTypes = this.RoadTypes.bind(this)
        this.onSlopeVal = this.onSlopeVal.bind(this)
        this.onSpeedVal = this.onSpeedVal.bind(this)
        this.SubmitClick = this.SubmitClick.bind(this)
  }
  //初始化数据
  componentDidMount() {
    this.props.stepGo()
  }
  //选路况
  RoadTypes(event){
    Tool.localItem('RoadVal',event.target.dataset['id']);
      this.props.selectRoad(event.target.dataset['id']);
    this.TonIsTrue()

  }
  //开启输入
  TonIsTrue(){
    let RoadVal = Tool.localItem('RoadVal')  
    let Slope = document.getElementById("Slope");
    let Speed = document.getElementById("Speed");
    if(RoadVal !== ''){
      Slope.removeAttribute("disabled");
      Speed.removeAttribute("disabled");
      //Slope.focus();
    }
  }
  //判断输入坡度
  onSlopeVal(event){
    let SlopeVal;
      if(isNaN(parseInt(event.target.value))){
          SlopeVal = ''
      }else{
          SlopeVal = event.target.value;
      }
      this.props.onSlopeVal(event.target.value)
    Tool.localItem('SlopeVal',SlopeVal);
  }
  //判断输入车速
  onSpeedVal(event){
    let SpeedVal;
      if(isNaN(parseInt(event.target.value))){
          SpeedVal = ''
      }else{
          SpeedVal = parseInt(event.target.value);
      }
      this.props.onSpeedVal(event.target.value)
    Tool.localItem('SpeedVal',SpeedVal)
  }

  //点击完成
  SubmitClick(event){
    let RoadVal = Tool.localItem('RoadVal')
    let SpeedVal = Tool.localItem('SpeedVal')
    let SlopeVal = Tool.localItem('SlopeVal')
    if(RoadVal === ''){
      return Alert.to("请选择驾驶路况")
    }
    if(SlopeVal !== ''){
      let r = /^\+?[0-9][0-9]*$/;
      if(!r.test(Math.ceil(SlopeVal))){
        return Alert.to("请输入有效数字(0~12%)")
      }else if(SlopeVal < 0 || SlopeVal > 12){
        return Alert.to("请确认平均坡度(0~12%)")
      }
    }else{
      return Alert.to("请确认平均坡度(0~12%)")
    }
    if(SpeedVal !== ''){
      let r = /^\+?[1-9][0-9]*$/;
      if(!r.test(SpeedVal)){
        return Alert.to("请输入有效数字(30~120km/h)")
      }else if(SpeedVal < 30 || SpeedVal > 120){
        return Alert.to("请确认平均经济车速(30~120km/h)")
      }
    }else{
      return Alert.to("请确认平均经济车速(30~120km/h)")
    }
    this.props.onSubmitClick()
  }
  render() {
    return (
      <div className="stepOne StepTwo">
        <header>
            <div>
                <span><em>√</em><span>···</span></span>
                <div></div>
                <span><span>···</span></span>
            </div>
        </header>
        <form action="">
          <section className="selectRoad">
            <header className="serial">
                <em></em><span>请选择驾驶路况</span>
            </header>
            <div className="select-radio">
                <label>
                    <input type="radio" name="selectRoad" value="平原" checked={this.props.Datas.RoadVal == 1 ? true : false}/>
                    <span onClick={this.RoadTypes} data-id="1">平原</span>
                </label>
                <label>
                    <input type="radio" name="selectRoad" value="山地" data-id="2" checked={this.props.Datas.RoadVal == 2 ? true : false}/>
                    <span onClick={this.RoadTypes} data-id="2">山地</span>
                </label>
                <label>
                    <input type="radio" name="selectRoad" value="丘陵" data-id="3" checked={this.props.Datas.RoadVal == 3 ? true : false}/>
                    <span onClick={this.RoadTypes} data-id="3">丘陵</span>
                </label>
                <label>
                    <input type="radio" name="selectRoad" value="综合" data-id="4" checked={this.props.Datas.RoadVal == 4 ? true : false}/>
                    <span onClick={this.RoadTypes} data-id="4">综合</span>
                </label>
            </div>
            <header className="serial">
                <em></em><span>请确认平均坡度</span><em>(可修改)</em>
            </header>
            <div className="select-text">
                平均坡度<span><input type="number" id="Slope" placeholder="" disabled={this.props.Datas.RoadVal == '' ? true : false} onChange={this.onSlopeVal}  value={this.props.Datas.SlopeVal} />%</span>
            </div>
            <header className="serial">
                <em></em><span>请确认平均经济车速</span><em>(可修改)</em>
            </header>
            <div className="select-text">
                <span>平均经济车速</span>
                <span><input type="tel" id="Speed" placeholder="" disabled={this.props.Datas.RoadVal == '' ? true : false} onChange={this.onSpeedVal}  value={this.props.Datas.SpeedCarVal} />km/h</span>
            </div>
            <div className="buttons">
              <div><span onClick={this.props.onNextClick}>上一步</span></div>
              <div><span onClick={this.SubmitClick}>完成</span></div>
            </div>
          </section>
        </form>
        <ShowAlert />
      </div>
    )
  }
}

export default List

