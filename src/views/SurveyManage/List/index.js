import React, { Component } from 'react';
import ReactDOM  from 'react-dom';
import axios from 'axios';
import Search from  '../../components/search/search';
import SearchText from  '../../components/search/search-text';
import SearchSelect from  '../../components/search/search-select';
import SearchSubmit from  '../../components/search/search-submit';
import { Table, Modal, message } from 'antd';



let columns = [
    {
        title: '问卷名称',
        dataIndex: 'subject'
    }
    ,{
        title: '创建人',
        dataIndex: 'creatorName'
    }
    ,{
        title: '创建时间',
        dataIndex: 'createDate'
    }
    ,{
        title: '发布时间',
        dataIndex: 'name'
    }
    ,{
        title: '状态',
        dataIndex: 'status'
    }
]

export default class SurveyList extends Component {
    constructor(props){
        super(props);
        this.state =  {
           open: false,
           condition: {
                subject: '1231',
                status: 1
           },
           listData:[]
        }

        this.columns = columns.concat({
            title: '操作',
            render: row => {
                let status = row.status;

                return (
                    <div style={{textAlign: 'center'}}>
                        <button
                            className="btn btn-primary btn-sm"
                            style={{marginRight: '5px'}}
                        >修改</button>
                        <button
                            onClick={() => {
                                this.showDeleteConfirm(row.id);
                                this.setState({open: true});
                            }}
                            className="btn btn-primary btn-sm"
                            style={{marginRight: '5px'}}
                        >删除</button>
                       <button
                           className="btn btn-primary btn-sm"
                       >预览</button>
                    </div>
                )
            }
        });
    }
    componentWillMount(){
        this.renderListTable(this.state.condition);
    }
    renderListTable(condition) {
        console.log('condition:', condition);
        axios.post('/survey/manageSurvey', condition)
            .then((res)=>{
                this.setState({
                    listData: res.data.data
                })
            })
            .catch(function (error) {
                message.error('服务异常，请稍后在试！');
            });
    }
    showDeleteConfirm(id) {
        Modal.confirm({
            title: '提示',
            content: '确定删除？',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                axios.post('/survey/deleteSurvey', {id: id})
                    .then((res)=>{
                        if (0 !== res.data.error.returnCode) {
                            message.error(res.data.error.returnUserMessage);
                        }
                        message.error('删除成功！');
                        this.renderListTable(this.state.condition);
                    })
                    .catch(function (error) {
                        console.log(error)
                        message.error('服务异常，请稍后在试！');
                    });
            }
        });
    }
    searchSubmitHandler(e){
        e.preventDefault();
        this.renderListTable(this.state.condition)
    }
    handleDel(){
    }
    render() {
        return (
            <div>
                <div className="card">
                    <div className="card-header">
                        <Search condition={this.state.condition} onSubmit={this.searchSubmitHandler.bind(this)}>
                            <SearchText
                                label="问卷名称"
                                field="subject"
                            />
                            <SearchSelect
                                label="状态"
                                field="status"
                                optionsData={[{value:0, text:'全部'},{value:1, text:'是'}]}
                            />
                            <SearchSubmit />
                        </Search>
                    </div>
                    <div className="card-body">
                        <Table
                            rowKey="id"
                            dataSource={this.state.listData}
                            columns={this.columns}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
