import React, { Component, PropTypes } from 'react'
import ShowAlert from '../components/Alert'
import { Tool,Alert } from '../utils/fetch'

class One extends Component {
  constructor(props) {
        super(props);
        this.SelectChange = this.SelectChange.bind(this)
        this.CarTypes = this.CarTypes.bind(this)
        this.onWeightVal = this.onWeightVal.bind(this)
        this.NextClicks = this.NextClicks.bind(this)
  }
  //初始化数据
  componentDidMount() {
    let steps = Tool.localItem('stepGo')
    if(steps === null){
      Tool.localItem('stepGo','stepOne')
    }
    this.props.selectState()
  }
  //选驱动事件
  SelectChange(event){
    Tool.localItem('DriveVal',JSON.stringify({'name':event.target.innerHTML,'val':event.target.dataset['id']}))
    this.props.DriveType(event.target.value)
    this.TonIsTrue()

  }
  //选车型组事件
  CarTypes(event){
    let val =Tool.localItem('TypeVal')
    Tool.localItem('TypeVal',event.target.dataset['id']);
    this.props.CarType(val);
    this.TonIsTrue()

  }
  //输入吨事件
  onWeightVal(event){
    let TonVals;
    if(isNaN(parseInt(event.target.value))){
        TonVals = ''
    }else{
        TonVals = parseInt(event.target.value);
    }
    Tool.localItem('TonVal',TonVals)
    this.props.onWeightVal(TonVals)
  }
  //判断是否开启输入
  TonIsTrue(){
    let TypeVal = Tool.localItem('TypeVal')
    let DriveVal = Tool.localItem('DriveVal')
    let Ton = document.getElementById("Ton");
    if(TypeVal !== '' && DriveVal !== ''){
      Ton.removeAttribute("disabled");
    }else{
        Ton.setAttribute("disabled",'true');
    }
  }
  //点击下一步
  NextClicks(event){
    let TypeVal = Tool.localItem('TypeVal')
    let DriveVal = Tool.localItem('DriveVal')
    let TonVal = Tool.localItem('TonVal')
    if(TypeVal === ''){
      return Alert.to("请选择用途类别")
    }
    if(DriveVal === ''){
      return Alert.to("请选择驱动形式")
    }
    if(TonVal !== ''){
      let r = /^\+?[1-9][0-9]*$/;
      if(!r.test(TonVal)){
        return Alert.to("请输入有效数字(5~150吨)")
      }else if(TonVal < 5 || TonVal > 150){
        return Alert.to("请输入有效车货总重(5~150吨)")
      }
    }else{
      return Alert.to("请输入有效车货总重(5~150吨)")
    }
    this.props.onNextClick()
  }
  render() {
    //初始化驱动组----可选
    let active = this.props.Datas.DriveVals.activ.map(function(ele,index){
      let drives = Tool.localItem('DriveVal')
      drives && (drives = JSON.parse(drives).name);
      return(
          <label key={index}>
              <input type='radio' name='drive' value={ele} checked={drives == ele ? true : false}/>
              <span data-id={this.props.Datas.DriveVals.name[index]} onClick={this.SelectChange}>{ele}</span>
          </label>
      )
    }.bind(this));
    //初始化驱动组----不可选
    // let disabled  = this.props.Datas.DriveVals.name.map(function(ele,index){
    //     return(
    //         <label key={index}>
    //             <input type='radio' value={ele} disabled='true' />
    //             <span>{ele}</span>
    //         </label>
    //     )
    // });
    //初始化卡车类型
    let carType = this.props.Datas.CarData.name.map(function(ele,index){
      let car_type = Tool.localItem('TypeVal');
      return(
          <label key={index}>
            <input type='radio' name='selectType' value={ele} checked={car_type == this.props.Datas.CarData.id[index] ? true : false} />
            <span data-id={this.props.Datas.CarData.id[index]} onClick={this.CarTypes}>{ele}</span>
          </label>
      )
    }.bind(this))
    return (
      <div className="stepOne">
        <header>
            <div>
                <span><em>√</em><span>···</span></span>
                <div></div>
                <span><span>···</span></span>
            </div>
        </header>
        <form action="">
          <section className="selectCar">
            <header className="serial">
              <em></em><span>请选择用途类别</span>
            </header>
            <div className="select-radio">
              {carType}
            </div>
            <header className="serial"><em></em><span>请选择驱动形式</span>
            </header>
            <div className="select-drive">
              {active}
            </div>
            <header className="serial">
              <em></em><span>请确认车货总重</span><em>(可修改)</em>
            </header>
            <div className="select-text">
              <span>车货总重</span>
              <span><input type="tel" name="weight" placeholder="" onChange={this.onWeightVal} disabled={((this.props.Datas.DriveVal == '') && (this.props.Datas.TypeVal == '' )) ? true : false} id="Ton"  value={this.props.Datas.WeightVal}/>吨</span>
            </div>
            <span className="nextStep" onClick={this.NextClicks}>下一步</span>
          </section>
        </form>
        <ShowAlert />
      </div>
    )
  }
}

export default One
