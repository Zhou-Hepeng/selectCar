import React, { Component, PropTypes } from 'react'
import {Tool,Alert} from '../utils/fetch'
import StepOne from '../components/One'
import StepTwo from '../components/Two'
import Loading from '../components/Loading'
import StepThree from '../components/Three'

import '../less/select_car.less';
class App extends Component {
    constructor() {
        super();
        this.state = {
            step: 'stepOne',
            TypeVal:'',               //类别选择的值
            DriveVal:'',              //驱动形式选择的值
            WeightVal:'',             //车货总重的值
            RoadVal:'' ,              //驾驶路况的值
            SlopeVal:'',              //最大坡度的值
            SpeedCarVal:'',           //经济车速的值
            sort:'1',                 //价格和热门的排序值
            page:'2',                 //页数
            isLoadPage:true,          //是否正在加载
            LoadingVal:true,
            brandId:0,                //品牌id
            LoadList:false,           //正在加载时候的状态
            SelectHotBrand:true,      //选择热门品牌，热门品牌排序否发生变化
            ClearData:true,           //是否清除缓存
            OpenId:true,              //请求用户微信openID
            CarData:{
                name:['牵引车','载货车','自卸车'],
                id:['66','64','63']
            },
            DriveVals:{     
                    activ:['4X2','6X2','6X4','8X4','8X2'],
                    name:[]
            },
            data: {

            },
            A:['A','B','C','F','C','F']
        };
        this.NextClick = this.NextClick.bind(this);
        this.CarType = this.CarType.bind(this);
        this.DriveType = this.DriveType.bind(this);
        this.WeightVal = this.WeightVal.bind(this);
        this.SubmitClick = this.SubmitClick.bind(this);
        this.LoadThreeData =this.LoadThreeData.bind(this);
        this.LoadingDatas = this.LoadingDatas.bind(this);
        this.Reloads = this.Reloads.bind(this);
        this.PriceSort = this.PriceSort.bind(this);
        this.HotSort = this.HotSort.bind(this);
        this.Unlimited = this.Unlimited.bind(this);
        this.ClickList = this.ClickList.bind(this);
        this.ClickSidebar = this.ClickSidebar.bind(this);
        this.stepGo = this.stepGo.bind(this);
        this.selectBrand = this.selectBrand.bind(this);
        this.selectState = this.selectState.bind(this);
        this.selectRoad = this.selectRoad.bind(this);
        this.SlopeVal = this.SlopeVal.bind(this);
        this.SpeedVal = this.SpeedVal.bind(this);

    }
    //异步触发加载第三页数据
    LoadingDatas() {

        if(this.state.isLoadPage){
            let page = this.state.page;
            let sort = this.state.sort;
            let brandId = this.state.brandId;
            let _this = this;
            this.setState({
                isLoadPage:false,
                LoadList:true
            });
            Tool.post('http://product.360che.com/index.php?r=webchat/selectproduct/productlist',Tool.parameter('',sort,brandId,page,'more'),function(data){
                if(data.status == 1 && data.data.length){
                    let page = JSON.parse(Tool.localItem('page'));
                    data.data.map(function(ele,index){
                        page.push(ele)
                    });
                    let Datas = _this.state.data;
                    Datas.data = page;
                    _this.setState({
                        isLoadPage:true,
                        data:Datas,
                        page:_this.state.page + 1,
                        LoadList:false
                    });
                    _this.LoadThreeData(Datas,'noLoading')
                    Tool.localItem('page',JSON.stringify(page));
                }else{
                    _this.setState({
                        LoadList:false
                    });
                }
            },function(){
                return Alert.to("获取数据失败...");
                _this.setState({
                    isLoadPage:true,
                    LoadList:false
                });
            })
        }

    }

    componentDidMount() {
        
    }
    //缓存第几步
    stepGo(){
        let steps = Tool.localItem('stepGo')
        this.setState({
            step: steps
        });
    }
    //第三页，重置条件
    Reloads(){
        Tool.ThreeGA();  //第三页跳转到第一页发送的GA
        Tool.localItem('TypeVal','')
        Tool.localItem('DriveVal','')
        Tool.localItem('TonVal','')
        Tool.localItem('RoadVal','')
        Tool.localItem('SlopeVal','')
        Tool.localItem('SpeedVal','')
        Tool.localItem('stepGo','stepOne')
        Tool.localItem('Brand','')
        let vlas = (this.state.step == "stepThree")? "stepOne" : "stepThree";
        this.setState({
            step: vlas,
            WeightVal:'',             //车货总重的值
            RoadVal:'' ,              //驾驶路况的值
            SlopeVal:'',              //最大坡度的值
            SpeedCarVal:'',           //经济车速的值
            sort:'1',                 //价格和热门的排序值
            page:'2',                 //页数
            brandId:0,                 //品牌
            isLoadPage:true,           //列表加载更多
            SelectHotBrand:true
        });

        let index_nav = document.querySelector('#index_nav');
        let index_selected = document.querySelector('#index_selected');
        index_nav.parentNode.removeChild(index_nav);
        index_selected.parentNode.removeChild(index_selected);
    }

    //第三页品牌选择
    selectBrand(event){
        Tool.twoGA();
        event.preventDefault()
        this.setState({
            sort:1,
            brandId:event.target.dataset['id'],
            SelectHotBrand:false
        });

        this.LoadThree();
        Tool.localItem('Brand',event.target.dataset['id'])

    }
    handleChange(event){
        this.setState({value: event.target.value});
    }
    //第一步点击下一步
    NextClick(){
        let steps = Tool.localItem('stepGo');
        if(steps == "stepOne"){
            Tool.oneGA();   //发送ga
        }else{
            Tool.ThreeGA();
        }
        Tool.localItem('stepGo',steps=="stepOne" ? "stepTwo" : "stepOne")
        let vlas = (this.state.step == "stepOne")? "stepTwo" : "stepOne"
        this.setState({
            step: vlas,
            ClearData:false
        });
    }
    //第二步点击提交
    SubmitClick(){
        Tool.twoGA(); //发送ga
        let vlas = (this.state.step == "stepTwo")? "Loading" : "stepTwo";
        this.setState({
            step: vlas
        });
    }
    
    //第一步选车型
    CarType(val){
        let TypeVal = Tool.localItem('TypeVal');
        if(TypeVal && (val !== TypeVal)){
            this.setState({
                TypeVal:val,
                DriveVal:'',
                WeightVal:''
            })
            Tool.localItem('DriveVal','')           // 换车型后重新选择驱动形式
        }
        //发送参数
        let _this = this;
        let drive    = Tool.localItem(Tool.localItem('TypeVal'));      //获取当前用途类别
        let DriveVal = Tool.localItem('DriveVal');      //获取当前驱动形式的
        if(drive){
            _this.setState({DriveVals:{activ:JSON.parse(drive).activ,name:JSON.parse(drive).name}})
        }else{
            Tool.post('http://product.360che.com/index.php?r=webchat/selectproduct/drivelist',Tool.parameter(),function(data){
                if(data.status == 1){
                    let activeValue = [],
                        nameValue   = [];
                    data.data.map(function(ele){
                        activeValue.push(ele.F_SearchName)
                        nameValue.push(ele.F_SearchId)
                    });
                    _this.setState({DriveVals:{activ:activeValue,name:nameValue}})
                    Tool.localItem(Tool.localItem('TypeVal'),JSON.stringify({activ:activeValue,name:nameValue}))
                }
            })            
        }

    }
    //第二步选驱动组
    DriveType(val){
        if(val !== this.state.DriveVal){
            this.setState({
                DriveVal:val
            })
        }
        let _this     = this;

        Tool.post('http://product.360che.com/index.php?r=webchat/selectproduct/parameter',Tool.parameter(1),function(data){
            _this.setState({WeightVal:data.data.value})
            Tool.localItem('TonVal',data.data.value)
        }) 
    }
    //第一步输入值吨
    WeightVal(val){
        if(val !== this.state.WeightVal){
            this.setState({
                WeightVal:val
            })
        }
    }

    //第二屏选择路况
    selectRoad(val){
        let _this = this;

        this.setState({
            RoadVal:val
        });
        Tool.post('http://product.360che.com/index.php?r=webchat/selectproduct/parameter',Tool.parameter(5),function(data){
            if(data.status == 1){
                _this.setState({
                    SlopeVal:data.data.value
                })
            }
            Tool.localItem('SlopeVal',data.data.value)
        });

        //请求最大经济车速
        Tool.post('http://product.360che.com/index.php?r=webchat/selectproduct/parameter',Tool.parameter(7),function(data){
            if(data.status == 1){
                _this.setState({
                    SpeedCarVal:data.data.value
                })
            }
            Tool.localItem('SpeedVal',data.data.value)
        })
    }

    //最大坡度的值
    SlopeVal(val){
        this.setState({
            SlopeVal:val
        })
    }
    //最大经济车速的值
    SpeedVal(val){
        this.setState({
            SpeedCarVal:val
        })
    }

    //请求数据完毕渲染第三屏
    LoadThree(sort){
        if(!sort){
            let steps = Tool.localItem('stepGo');
            Tool.localItem('stepGo','stepThree');
            let vlas = (this.state.step == "Loading")? "stepThree" : "Loading";
            this.setState({
                step: vlas
            });
        }else{
            this.setState({
                step: 'Loading'
            });
        }
        let index_nav = document.querySelector('#index_nav');
        let index_selected = document.querySelector('#index_selected');
        if(index_nav && index_nav.parentNode.tagName == 'BODY'){
            index_nav.parentNode.removeChild(index_nav);
            index_selected.parentNode.removeChild(index_selected)
        }
    }
    //更新第三屏数据
    LoadThreeData(obj,noLoading){

        //let hasObj = false
        //for (let prop in obj){
        //    hasObj = true
        //    break
        //}
        let SelectHotBrand = this.state.SelectHotBrand;
        let HotBrand = Tool.localItem('HotBrand');
        let Sidebar = Tool.localItem('Sidebar');
        //点击热门品牌的时候不改变热门品牌的排序
        if(!SelectHotBrand){
            obj.brandListHot = JSON.parse(HotBrand);
            obj.brandList  = JSON.parse(Sidebar);
        }
        this.setState({
            data: obj,
            isLoadPage:true
        });
        if(!noLoading){
            this.setState({
                page:2
            });
            this.LoadThree()
        }
    }

    //第三页 价格排序
    PriceSort(){
        Tool.twoGA();
        let sort = (this.state.sort == 4 ? 3 : 4);
        this.setState({
            //page:2,
            sort: sort
            //isLoadPage:true
        });
        Tool.localItem('SortVal',sort);
        this.LoadThree();
        //Tool.resultList(this,true);
    }
    //第三页 热度排序
    HotSort(){
        Tool.twoGA();
        if(this.state.sort !== 1){
            this.setState({
                //isLoadPage:true,
                //page:2,
                sort: 1
            });
            Tool.localItem('SortVal',1);
            this.LoadThree();
            //Tool.resultList(this,true);
        }
    }
    //第三页 不限品牌
    Unlimited(){
        Tool.twoGA();
        this.setState({
            //page:1,
            //isLoadPage:true,
            brandId:0
        });

        //清除已经选中的品牌值
        Tool.localItem('Brand','');

        this.LoadThree();
    }
    //第三页，点击结果列表
    ClickList(event,isApk){
        event.preventDefault();
        let target = event.target;
        let o = {};
        let userRecordId = Tool.localItem('userRecordId');
        let wx_id = Tool.localItem('wx_id');
        o.userRecordId = userRecordId || '';
        o.productId = Tool.parent(target,'data-id');
        o.wx_id = wx_id || '';

        o.token = Tool.base64('360che_product' + wx_id);

        Tool.post('http://product.360che.com/index.php?r=webchat/selectproduct/viewproductrecord',o,function(data){
            if(target.tagName == 'A'){
                location.href = target.href;
            }else{
                location.href = Tool.parent(target,'href')
            }
        })

        if(isApk){
            //统计标签   // 点击询底价按钮发送GA统计
            ga('send', 'event', "点击询底价按钮", "产品库_选车系统_筛选结果页", '');

            let exdate = new Date();
            let downUrl = window.location.href;
            let allImgO = document.getElementById('specialAskPrice');
            if (allImgO) {
                allImgO.parentNode.removeChild(allImgO);
            }
            let img = document.createElement('img');
            img.id = 'specialAskPrice';
            img.src = 'http://stats.360che.com/xundijia_click.gif?place="modelList"&page=' + downUrl + '&ts=' + exdate.toGMTString();
            document.body.appendChild(img);
        }
    }
    //第三页，点击侧边栏列表
    ClickSidebar(event){
        Tool.twoGA();
        event.preventDefault()
        let brandId = Tool.parent(event.target,'data-id')
        this.setState({
            sort:1,
            brandId:brandId,
            SelectHotBrand:false
        });
        this.LoadThree();
        Tool.localItem('Brand',brandId)
    }
    //页面刷新恢复缓存状态
    selectState() {         //如果有缓存，那么直接读取本地缓存的值
        let ClearData = this.state.ClearData;
        let carType;
        let DriveVal;
        let TonVal;
        let RoadVal;
        let SlopeVal;
        let SpeedVal;


        //如果用户从产品库车型综述页回来，那么恢复之前保存结果
        let code = location.href.match(/code=([^&$]+)/) && location.href.match(/code=([^&$]+)/)[1];
        if(!code){
            Tool.localItem('isClickList','');
        }

        let isClickList = Tool.localItem('isClickList');
        if(isClickList){
            let sort = Tool.localItem('SortVal') || 1;
            this.setState({
                SelectHotBrand:false,
                sort:sort
            });
            this.LoadThree()
        }

        if(ClearData && !isClickList){  //清除数据

            carType = Tool.localItem('TypeVal','');
            DriveVal = Tool.localItem('DriveVal','');
            TonVal = Tool.localItem('TonVal','');
            RoadVal = Tool.localItem('RoadVal','');
            SlopeVal = Tool.localItem('SlopeVal','');
            SpeedVal = Tool.localItem('SpeedVal','');
            Tool.localItem('Brand','');                  //刷新页面清空选择品牌的值
            Tool.localItem('SortVal','');

            //进入页面获取ipenId,和请求appid

            //记录微信用户，分享

            //if(/MicroMessenger/i.test(navigator.userAgent)){
                Tool.post('http://product.360che.com/index.php?r=m/ajax/webchatauth',{},function(data){
                    if(data.status == 1){
                        let code = location.href.match(/code=([^&$]+)/) && location.href.match(/code=([^&$]+)/)[1];
                        if(code){
                            Tool.post('http://product.360che.com/index.php?r=m/ajax/webchatauth/openinfo',{'code':code,'redirecturi':encodeURIComponent(location.href)},function(data){

                                if(data.status == 1){

                                    //约定返回值清空缓存数据
                                    if(data.data.clearDate){
                                        Tool.localItem('66','');
                                        Tool.localItem('64','');
                                        Tool.localItem('63','');
                                        Tool.localItem('Datas','');
                                        Tool.localItem('Regain','');
                                        Tool.localItem('page','');
                                        Tool.localItem('HotBrand','');
                                        Tool.localItem('Sidebar','');
                                    }

                                    let AbcfN_userid = document.cookie.match(/AbcfN_userid=([^;$]+)/) && document.cookie.match(/AbcfN_userid=([^;$]+)/)[1];
                                    if(AbcfN_userid){
                                        Tool.localItem('wx_id',AbcfN_userid);
                                    }else{
                                        Tool.localItem('wx_id',data.data.openId);
                                    }
                                    window.wechatBaseData	= {
                                        debug:       false,
                                        appId: 		data.data.appId,
                                        timestamp: 	data.data.timestamp,
                                        nonceStr: 	data.data.nonceStr,
                                        signature: 	data.data.signature,
                                        jsApiList:['onMenuShareTimeline','onMenuShareAppMessage','menuItem:favorite','showAllNonBaseMenuItem','hideMenuItems']
                                    };

                                    wx.config(window.wechatBaseData);

                                    // 分享到朋友圈
                                    wx.onMenuShareTimeline({
                                        title: document.title,
                                        link: location.href,
                                        imgUrl: "http://static.360che.com/wap/images/bbs/defaults.jpg",
                                        success: function () {
                                            // 用户确认分享后执行的回调函数
                                        },
                                        cancel: function () {
                                            // 用户取消分享后执行的回调函数
                                        }
                                    });

                                    //分享给朋友
                                    wx.onMenuShareAppMessage({
                                        title: document.title,
                                        desc: document.querySelector('meta[name="description"]').content,
                                        link: location.href,
                                        imgUrl: "http://static.360che.com/wap/images/bbs/defaults.jpg",
                                        success: function () {

                                            // 用户确认分享后执行的回调函数
                                        },
                                        cancel: function () {

                                            // 用户取消分享后执行的回调函数
                                        }
                                    });

                                    wx.ready(function(){
                                        wx.showAllNonBaseMenuItem();
                                        wx.hideMenuItems({
                                            menuList: ["menuItem:editTag","menuItem:delete","menuItem:copyUrl","menuItem:share:qq","menuItem:share:QZone","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:email","menuItem:share:weiboApp"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                                        });
                                        // 分享到朋友圈
                                        wx.onMenuShareTimeline({
                                            title: document.title,
                                            link: location.href,
                                            imgUrl: "http://static.360che.com/wap/images/bbs/defaults.jpg",
                                            success: function () {
                                                // 用户确认分享后执行的回调函数
                                            },
                                            cancel: function () {
                                                // 用户取消分享后执行的回调函数
                                            }
                                        });
                                        //分享给朋友
                                        wx.onMenuShareAppMessage({
                                            title: document.title,
                                            desc: document.querySelector('meta[name="description"]').content,
                                            link: location.href,
                                            imgUrl: "http://static.360che.com/wap/images/bbs/defaults.jpg",
                                            success: function () {

                                                // 用户确认分享后执行的回调函数
                                            },
                                            cancel: function () {

                                                // 用户取消分享后执行的回调函数
                                            }
                                        });
                                    });
                                }
                            })
                        }else{
                            window.location.href = data.url;
                        }
                    }
                },function(){
                    console.log('shibai')
                });

        }else{        //保存
            carType = Tool.localItem('TypeVal');
            DriveVal = Tool.localItem('DriveVal');
            TonVal = Tool.localItem('TonVal');
            RoadVal = Tool.localItem('RoadVal');
            SlopeVal = Tool.localItem('SlopeVal');
            SpeedVal = Tool.localItem('SpeedVal');
        }

        if(carType){
            carType = JSON.parse(Tool.localItem(carType));
            this.setState({
                DriveVals:{
                    activ:carType.activ,
                    name:carType.name,
                    SelectHotBrand:true
                }
            })
        }

        if(DriveVal){
            DriveVal = JSON.parse(DriveVal);
            this.setState({
                DriveVal:DriveVal.val
            })
        }

        //车货总重的值
        if(TonVal){
            this.setState({
                WeightVal:TonVal
            })
        }

        //驾驶路况
        if(RoadVal){
            this.setState({
                RoadVal:RoadVal
            })
        }
        //最大坡度的值
        if(SlopeVal){
            this.setState({
                SlopeVal:SlopeVal

            })
        }
        //最大经济车速的值
        if(SpeedVal){
            this.setState({
                SpeedCarVal:SpeedVal
            })
        }

        //刷新页面重置条件
        this.setState({
            ClearData:true
        });

        //默认刷新页面返回第一页
        Tool.localItem('stepGo', "stepOne");


        //存入一个时间,如果时间超过一天，那么清空一下缓存，
        let dataTime = Tool.localItem('dataTime');
        if(dataTime){
            let date = new Date().getDate();
            if(date != dataTime){
                Tool.localItem('dataTime',date);
                clearData();
            }
        }else{
            let date = new Date().getDate();
            Tool.localItem('dataTime',date);
        }
        function clearData(){
            Tool.localItem('63','');
            Tool.localItem('64','');
            Tool.localItem('66','');
            Tool.localItem('Datas','');
            Tool.localItem('HotBrand','');
            Tool.localItem('Sidebar','');
            Tool.localItem('page','');
        }

    }
    render() {
        let bodys
        switch (this.state.step) {
            case "stepOne" :
              return bodys = <StepOne onNextClick={this.NextClick}
                                      CarType ={this.CarType}
                                      DriveType ={this.DriveType}
                                      onWeightVal = {this.WeightVal}
                                      Datas={this.state}
                                      selectState={this.selectState}
                                     />
            case "stepTwo" :
              return bodys = <StepTwo onNextClick={this.NextClick}
                                      onSubmitClick={this.SubmitClick}
                                      stepGo = {this.stepGo}
                                      Datas={this.state}
                                      selectRoad = {this.selectRoad}
                                      onSlopeVal = {this.SlopeVal}
                                      onSpeedVal = {this.SpeedVal} />
            case "Loading" :
              return bodys = <Loading LoadThreeData={this.LoadThreeData}
                                      Back={this.SubmitClick}
                                      SortList={this.state}/>
            case "stepThree" :
              return bodys = <StepThree Reloads={this.Reloads}
                                        Datas={this.state}
                                        LoadingDatas={this.LoadingDatas}
                                        stepGo = {this.stepGo}
                                        selectBrand = {this.selectBrand}
                                        PriceSort = {this.PriceSort}
                                        HotSort = {this.HotSort}
                                        Unlimited = {this.Unlimited}
                                        ClickList = {this.ClickList}
                                        ClickSidebar = {this.ClickSidebar}/>
        }
        return (
            <div>
                {bodys}
            </div>
        )
    }
}

export default App

