import React, { PropTypes, Component } from 'react'
import { Tool ,NavTouch,Alert} from '../utils/fetch'
import ShowAlert from '../components/Alert'


//结果列表

class ResultList extends Component{
  constructor(props) {
      super(props);
      this.Datas = this.props.Datas.data;
    }
    render() {
        let self = this
        return(
        <div>
            <ul className="result-list" id="result_list">
            {this.Datas.data.map(function(e,index){
                return(
                <li key={index} data-id={e.F_ProductId}>
                    <a className="truck-info" href={e.url} onClick={self.props.ClickList}>
                        <p>
                            <span><img src={e.imgSrc !== null ? e.imgSrc : "http://usr.im/120x80"} /></span>
                            <span>{e.F_ProductName}</span>
                        </p>
                        <div className="tags">
                           {e.paramDetail}
                        </div>
                        <span>厂商指导价：<em className={e.F_Price !== '暂无报价' ? 'price' : ''}>{e.F_Price}</em></span>
                    </a>
                    <a href={e.askPrice} onClick={self.props.ClickAsk}>询底价</a>
                </li>
                )})
            }
            </ul>
        </div>
        )
    }
}

class Three extends Component {

    constructor(props) {
        super(props);
        this.ShowSidebar = this.ShowSidebar.bind(this)
        this.HidSidebar = this.HidSidebar.bind(this)
        this.ClickList = this.ClickList.bind(this)
        this.ClickAsk = this.ClickAsk.bind(this)
        this.ClickSidebar = this.ClickSidebar.bind(this)
        this.Unlimited = this.Unlimited.bind(this)
        this.inits = this.inits.bind(this)
        let S_Data = this.props.Datas.data;
        let AD = this.props.Datas
        let TypeVal = Tool.localItem('TypeVal')
        let DriveVal = Tool.localItem('DriveVal')
        let RoadVal = Tool.localItem('RoadVal')
        let Datas = this.props.Datas.data;
        this.store = {
          Sldebar : S_Data,
          Datas: AD,
          TypeVal:TypeVal,
          DriveVal:DriveVal,
          RoadVal:RoadVal
        }
    }
    
    ShowSidebar(){
        NavTouch.init();
        let index_nav = document.querySelector('#index_nav');
        index_nav.setAttribute('class','visible')
    }
    HidSidebar(){
        let Sidebar = document.getElementById('sidebar');
        let index_nav = document.querySelector('#index_nav');
        Sidebar.setAttribute('class','sidebar brand');
        index_nav.removeAttribute('class','visible');
    }
    //点击结果列表页
    ClickList(event){
        Tool.localItem('isClickList','true')
        this.props.ClickList(event)
    }
    //点击询底价
    ClickAsk(event){
        Tool.localItem('isClickList','true')
        this.props.ClickList(event,'isApk')
    }
    //点击侧边栏列表
    ClickSidebar(event){
        let index_nav = document.querySelector('#index_nav');
        index_nav.removeAttribute('class','visible');
        this.props.ClickSidebar(event)
    }

    //点击不限
    Unlimited(){
        let index_nav = document.querySelector('#index_nav');
        index_nav.removeAttribute('class','visible');
        this.props.Unlimited()
    }
    inits(){
      var self = this;
      var BodyMin = document.getElementById('wrapper');
      var DataMin,Hit,LastLi,goNumb;
      BodyMin.addEventListener('scroll',function(e) {
          DataMin = BodyMin.scrollHeight;
          Hit  = window.screen.height;
          LastLi = BodyMin.scrollTop;
          goNumb = DataMin - Hit - LastLi;
          if(goNumb < 10 && self.props.Datas.isLoadPage){
            BodyMin.scrollTop = DataMin;
            self.props.LoadingDatas()
          }
      },false)
    }

    componentDidMount() {
      this.props.stepGo()
      this.inits()
    }
    render() {
      let self = this;
        let HeadBtn = this.store.Datas.data.brandListHot.map(function(ele,index){
          let brands = Tool.localItem('Brand')
            if(ele.F_BrandName){
                return(
                  <div key={index}>
                     <span className={ele.F_BrandId === brands ? 'active':''} onClick={self.props.selectBrand} data-id={ele.F_BrandId}>{ele.F_BrandName}</span>
                  </div>
                )
            }
        })
        
        return (
            <div className="result" id="ResultBody">
                <div>
                    <header className='resulet-name'>
                      <h3>
                        {this.store.Datas.data.title}
                      </h3>
                      <div onClick={this.props.Reloads}>重新筛选</div>
                    </header>
                </div>
                <div className="brand-filtration">
                    <header>品牌筛选</header>
                    {HeadBtn}
                    <div>
                        <span className="more-brand" onClick={this.ShowSidebar}>更多品牌</span>
                    </div> 
                </div>


                <div className="result-sort">
                    <span>共有<em>{this.store.Datas.data.total}</em>款车型</span>
                    <span className={this.props.Datas.sort == 3 ? 'price visible bottom' : (this.props.Datas.sort == 4 ? 'price visible top' : 'price')} onClick={this.props.PriceSort}>价格</span>
                    <span className={this.props.Datas.sort == 1 ? 'hot visible' : 'hot'} onClick={this.props.HotSort}>热度</span>
                </div>

                <ResultList  Datas={this.props.Datas} ClickList={this.ClickList} ClickAsk={this.ClickAsk}/>
                <div className={this.props.Datas.LoadList ? "list-loading" : "list-loading noLoad"}><span className="loading-ring">等</span>正在加载更多...</div>
                <Sldebar Datas={this.store.Sldebar}
                          HidSidebar={this.HidSidebar}
                          NewDatas={this.HidSidebar}
                          Unlimited={this.Unlimited}
                          ClickSidebar={this.ClickSidebar}/>
                <ShowAlert />
            </div>
        )
    }
}
//加载组建

//{this.store.Datas.LoadingVal ? <LoadAd /> : null}
//class LoadAd extends Component{
//  render(){
//    return(
//        <div className="spinner">
//          <div className="bounce1"></div>
//          <div className="bounce2"></div>
//          <div className="bounce3"></div>
//        </div>
//    )
//  }
//}

// 侧边栏
class Sldebar extends Component{
    constructor(props) {
          super(props);
          this.Datas = this.props.Datas;
          this.NewDatas = this.props.NewDatas;
          this.ABC ={
            'A':[],
            'B':[]
          }
        for(let key in this.Datas.brandList){
            this.ABC.A.push(key)
            this.ABC.B.push(this.Datas.brandList[key])
        }
    }

   render(){
    let Datas = this.ABC;
    let _this = this;
       return(
          <div>
           <aside className="sidebar brand" id="sidebar">
              <header>
                  <span>品牌筛选</span>
                  <span className="close" id="sidebar_close"  onClick={this.props.HidSidebar}></span>
             </header>
             <div className="sidebar-container"  id="sidebar_content">
                 <div className="brand-all" onClick={this.props.Unlimited}>
                         <span>ALL</span>
                         <span>不限</span>
                 </div>
                {Datas.A.map(function(e,indexs){
                    let Brand = Tool.localItem('Brand')
                    if(e){
                        return(
                          <div className="sidebar-module" key={indexs}>
                             <header id={e}>{e}</header>
                             <ul>
                             {
                                Datas.B[indexs].map(function(ele,index){
                                    return(
                                        <li key={index}>
                                           <a href={ele.url} alt={ele.F_BrandName} data-id={ele.F_BrandId} onClick={_this.props.ClickSidebar} className={Brand == ele.F_BrandId ? 'active' : ''}>
                                               <figure><img src={ele.logo} alt={ele.F_BrandName}/></figure>
                                               <span>{ele.F_BrandName}</span>
                                           </a>
                                        </li>
                                      )
                                  })
                                }
                             </ul>
                           </div>
                        )
                    }
                  })
                }
                 <aside className="scale" id="index_selected">A</aside>
                 <ul id="index_nav">
                    {Datas.A.map(function(e,indexs){
                      return(
                       <li key={indexs}>{e}</li>
                     )})
                  }
                 </ul>
            </div>
          </aside>
        </div>
        )
    }
}
export default Three

