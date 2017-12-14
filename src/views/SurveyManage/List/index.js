import React, { Component } from 'react';
import ReactDOM  from 'react-dom';
import axios from 'axios';
import Search from  '../../components/search/search';
import SearchText from  '../../components/search/search-text';
import SearchSelect from  '../../components/search/search-select';
import SearchSubmit from  '../../components/search/search-submit';
import { Redirect } from 'react-router-dom';
import { Pagination, Button, Table, Modal, message, Card } from 'antd';
import Breadcrumb from '../../components/breadcrumb';



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
            condition: {
                pageNum: 1,
                pageSize: 10
            },
           listData:[]
        }

        this.columns = columns.concat({
            title: '操作',
            render: row => {
                return (
                    <div style={{textAlign: 'center'}}>
                        <Button
                            size="small"
                            style={{marginRight: '5px'}}
                            onClick={()=>{
                                this.setState({targeModifyId: row.id});
                            }}
                        >修改</Button>

                        <Button
                            onClick={() => {
                                this.showDeleteConfirm(row.id);
                            }}
                            size="small"
                            style={{marginRight: '5px'}}
                        >删除</Button>

                       <Button size="small">预览</Button>
                    </div>
                )
            }
        });
    }
    componentWillMount(){
        this.renderListTable(this.state.condition);
    }
    renderListTable(condition) {
        axios.post('/survey/manageSurvey', condition)
            .then((res)=>{
                debugger;
                if(0 !== res.data.error.returnCode) {
                    message.error(res.data.error.returnUserMessage);
                    return;
                }
                this.setState({
                    listData: res.data.data,
                    total: res.data.totalCount
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
                            return;
                        }
                        message.success('删除成功！');
                        this.renderListTable(this.state.condition);
                    })
                    .catch(function (error) {
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
        if(this.state.isNewAdd) {
            return <Redirect to="/surveyManage/detail/0" />
        }
        if(this.state.targeModifyId) {
            return <Redirect to={`/surveyManage/detail/${this.state.targeModifyId}`} />
        }

        return (
            <div>
                <Breadcrumb routes={[
                    {path:'', name: '问卷列表'}
                ]} />
                <Card
                    title={
                        <Search condition={this.state.condition} onSubmit={this.searchSubmitHandler.bind(this)}>
                            <SearchText
                                label="问卷名称"
                                field="subject"
                            />
                            <SearchSelect
                                label="状态"
                                field="status"
                                optionsData={[
                                    {value:'', text:'全部'},
                                    {value:0, text:'未发布'},
                                    {value:1, text:'已发布'}
                                ]}
                            />
                            <SearchSubmit />
                        </Search>
                    }
                    extra={
                        <Button onClick={()=>this.setState({isNewAdd: true})}>新增问卷</Button>
                    }
                >
                    <div className="card-body">
                        <Table
                            rowKey="id"
                            dataSource={this.state.listData}
                            columns={this.columns}
                            pagination={false}
                        />
                    </div>
                </Card>
            </div>
        )
    }
}
