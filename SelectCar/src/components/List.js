import React, { Component, PropTypes } from 'react'

class Drive extends Component{
  constructor(props) {
        super(props);
  }
  SelectChange(event){
      this.props.SelectChange(event.target.value)
  }
  render(){
    let _this = this
    let active = this.props.Drives.activ.map(function(ele,index){
        return(
            <label key={index}>
                <input type='radio' name='drive' onChange={_this.SelectChange} value={ele}/>
                <span>{ele}</span>
            </label>
        )
    });

    let disabled  = this.props.Drives.disabled.map(function(ele,index){
        return(
            <label key={'s' + index}>
                <input type='radio' value={ele} disabled="true"/>
                <span>{ele}</span>
            </label>
        )
    });
    return(
      <div className="select-drive">
        {active}
        {disabled}
      </div>
    )
  }
}

export default Drive
