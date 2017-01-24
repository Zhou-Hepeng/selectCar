import React, { PropTypes, Component } from 'react'
import { Tool,Alert } from '../utils/fetch'
import ShowAlert from '../components/Alert'
class LoadNext extends Component {

    constructor(props) {
        super(props);
        this.getData = () => {
            //Tool.resultList(this.props);

            //如果用户从产品库车型综述页回来，那么直接return，不在读取数据
            let isClickList = Tool.localItem('isClickList');

            if(isClickList){
                let Regain = JSON.parse(Tool.localItem('Regain'));
                this.props.LoadThreeData(Regain);
                Tool.localItem('isClickList','');
                return ;
            }

            //读取本地存储数据
            let TypeVal = Tool.localItem('TypeVal');
            let DriveVal = Tool.localItem('DriveVal');
            if(DriveVal){
                DriveVal = JSON.parse(DriveVal).val;
            }
            let TonVal = Tool.localItem('TonVal');
            let RoadVal = Tool.localItem('RoadVal');
            let SlopeVal = Tool.localItem('SlopeVal');
            let speedVal = Tool.localItem('SpeedVal');
            let o;
            if(Tool.localItem('Datas')){
                o = JSON.parse(Tool.localItem('Datas'))
            }

            //排序状态
            let sort = this.props.SortList.sort;
            let brandId = this.props.SortList.brandId;
            let SelectHotBrand = this.props.SortList.SelectHotBrand;

            if(o && o[TypeVal] && o[TypeVal][DriveVal] && o[TypeVal][DriveVal][TonVal] && o[TypeVal][DriveVal][TonVal][RoadVal] && o[TypeVal][DriveVal][TonVal][RoadVal][SlopeVal] && o[TypeVal][DriveVal][TonVal][RoadVal][SlopeVal][speedVal] && o[TypeVal][DriveVal][TonVal][RoadVal][SlopeVal][speedVal][brandId] && o[TypeVal][DriveVal][TonVal][RoadVal][SlopeVal][speedVal][brandId][sort]){
                let data = o[TypeVal][DriveVal][TonVal][RoadVal][SlopeVal][speedVal][brandId][sort];

                //console.log(data);
                //console.log('马力：',data.paramAll.soup);
                //data.paramAll.range.map(function(ele){
                //    console.log('桥速比范围：',ele.axleRatioRange)
                //    console.log('扭矩：',ele.engineTorque)
                //});
                //console.log('风阻系数：',data.paramAll.windageVal);
                //console.log('迎风面积：',data.paramAll.windwardAreaVal);
                //console.log('轮胎滚动半径：',data.paramAll.rollRadiusVal);
                //console.log('平均坡度：',data.paramAll.averageGradientVal);
                //console.log('平均坡度阻力：',data.paramAll.averageGradientResist);
                //console.log('总阻力：',data.paramAll.totalResist);


                this.props.LoadThreeData(data);
                Tool.localItem('page',JSON.stringify(data.data));               //保存page ==1 首屏内容，下拉加载不更改首屏内容
                Tool.localItem('HotBrand',JSON.stringify(data.brandListHot));   //保存热门品牌内容，点击热门品牌筛选的时候不更改热门品牌排序
                Tool.localItem('Sidebar',JSON.stringify(data.brandList));       //保存侧边栏内容，点击热门品牌的时候不更侧边栏内容
                Tool.localItem('Regain',JSON.stringify(data));                  //存储本次筛选结果，如果从产品综述页回来，恢复筛选结果


                Tool.localItem('userRecordId',data.userRecordId);  //存数用户访问时间
            }else{
                Tool.post('http://product.360che.com/index.php?r=webchat/selectproduct/productlist',Tool.parameter('',sort,brandId), (data) => {

                    if (data.status == 1 && data.data.length) {
                        let o;
                        if(Tool.localItem('Datas')){
                            o = JSON.parse(Tool.localItem('Datas'))
                        }else{
                            o = {}
                        }
                        let TypeVal = Tool.localItem('TypeVal');
                        let DriveVal = Tool.localItem('DriveVal');
                        if(DriveVal){
                            DriveVal = JSON.parse(DriveVal).val;
                        }
                        let TonVal = Tool.localItem('TonVal');
                        let RoadVal = Tool.localItem('RoadVal');
                        let SlopeVal = Tool.localItem('SlopeVal');
                        let speedVal = Tool.localItem('SpeedVal');

                        if(!o[TypeVal]) {
                            o[TypeVal] = {};
                        }
                        if(!o[TypeVal][DriveVal]) {
                            o[TypeVal][DriveVal] = {};
                        }
                        if(!o[TypeVal][DriveVal][TonVal]) {
                            o[TypeVal][DriveVal][TonVal] = {};
                        }
                        if(!o[TypeVal][DriveVal][TonVal][RoadVal]) {
                            o[TypeVal][DriveVal][TonVal][RoadVal] = {};
                        }
                        if(!o[TypeVal][DriveVal][TonVal][RoadVal][SlopeVal]) {
                            o[TypeVal][DriveVal][TonVal][RoadVal][SlopeVal] = {};
                        }
                        if(!o[TypeVal][DriveVal][TonVal][RoadVal][SlopeVal][speedVal]){
                            o[TypeVal][DriveVal][TonVal][RoadVal][SlopeVal][speedVal] = {};
                        }
                        if(!o[TypeVal][DriveVal][TonVal][RoadVal][SlopeVal][speedVal][brandId]){
                            o[TypeVal][DriveVal][TonVal][RoadVal][SlopeVal][speedVal][brandId] = {}
                        }
                        if(!o[TypeVal][DriveVal][TonVal][RoadVal][SlopeVal][speedVal][brandId][sort]){
                            o[TypeVal][DriveVal][TonVal][RoadVal][SlopeVal][speedVal][brandId][sort] = data
                        }
                        Tool.localItem('Datas',JSON.stringify(o));//存储所有数据
                        Tool.localItem('Regain',JSON.stringify(data));//存储本次筛选结果，如果从产品综述页回来，恢复筛选结果
                        Tool.localItem('page',JSON.stringify(data.data));//存储第一页列表


                        Tool.localItem('userRecordId',data.userRecordId);  //存数用户访问时间

                        if(SelectHotBrand){
                            Tool.localItem('HotBrand',JSON.stringify(data.brandListHot));
                            Tool.localItem('Sidebar',JSON.stringify(data.brandList));
                        }
                        //console.log(data);
                        //console.log('马力：',data.paramAll.soup);
                        //data.paramAll.range.map(function(ele){
                        //    console.log('桥速比范围：',ele.axleRatioRange)
                        //    console.log('扭矩：',ele.engineTorque)
                        //});
                        //console.log('风阻系数：',data.paramAll.windageVal);
                        //console.log('迎风面积：',data.paramAll.windwardAreaVal);
                        //console.log('轮胎滚动半径：',data.paramAll.rollRadiusVal);
                        //console.log('平均坡度：',data.paramAll.averageGradientVal);
                        //console.log('平均坡度阻力：',data.paramAll.averageGradientResist);
                        //console.log('总阻力：',data.paramAll.totalResist);

                        this.props.LoadThreeData(data);
                    }else{

                        //console.log('马力：',data.paramAll.soup);
                        //data.paramAll.range.map(function(ele){
                        //    console.log('桥速比范围：',ele.axleRatioRange)
                        //    console.log('扭矩：',ele.engineTorque)
                        //});
                        //console.log('风阻系数：',data.paramAll.windageVal);
                        //console.log('迎风面积：',data.paramAll.windwardAreaVal);
                        //console.log('轮胎滚动半径：',data.paramAll.rollRadiusVal);
                        //console.log('平均坡度：',data.paramAll.averageGradientVal);
                        //console.log('平均坡度阻力：',data.paramAll.averageGradientResist);
                        //console.log('总阻力：',data.paramAll.totalResist);

                        this.props.Back();
                        Tool.localItem('Brand','');
                        return Alert.to("抱歉，暂无车型");
                    }
                }.bind(this), (err) => {
                    this.props.Back()
                    return Alert.to("数据加载错误，请稍后重试...")
                    console.log(err,"获取数据失败")
                })
            }
        }
    }

    componentDidMount() {
        this.getData()
    }
    render() {
        return (
            <div>
                <aside className="loading" ><div className="list-loading"><span className="loading-ring">等</span>正在加载更多...</div></aside>
                <ShowAlert />
            </div>
        )
    }
}

export default LoadNext
