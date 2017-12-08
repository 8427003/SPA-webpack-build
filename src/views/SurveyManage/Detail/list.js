import React, { Component } from 'react';
import ReactDOM  from 'react-dom';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Table, Modal, message, Button, Card } from 'antd';

let columns = [
    {
        className: 'text-center',
        title: '序号',
        dataIndex: 'sequence'
    }
    ,{
        className: 'text-center',
        title: '题目',
        dataIndex: 'title'
    }
    ,{
        className: 'text-center',
        title: '类型',
        dataIndex: 'category'
    }
]

export default class QuestionList extends Component {
    constructor(props){
        super(props);

        this.columns = columns.concat({
            className: 'text-center',
            title: '操作',
            render: (row, record, index) => {
                return (
                    <div style={{textAlign: 'center'}}>
                        <Button
                            type="primary"
                            size="small"
                            icon="edit"
                            style={{marginRight: '5px'}}
                            onClick={()=>this.modifyHandler(row.id)}
                        >修改</Button>
                        <Button
                            type="primary"
                            size="small"
                            icon="delete"
                            style={{marginRight: '5px'}}
                            onClick={() => {
                                this.delHandler(row.id);
                            }}
                        >删除</Button>
                        {index !==0 &&
                            <Button
                                type="primary"
                                size="small"
                                icon="arrow-up"
                                style={{marginRight: '5px'}}
                                onClick={() =>this.upHandler(row.id)}
                            >上移</Button>
                        }
                        {index !== this.len - 1 &&
                            <Button
                                type="primary"
                                size="small"
                                icon="arrow-down"
                                style={{marginRight: '5px'}}
                                onClick={() => this.downHandler(row.id)}
                            >下移</Button>
                        }
                    </div>
                )
            }
        });
    }
    modifyHandler(id){
        this.setState({
            id: id,
            targetToModifyPage: true
        })
    }
    delHandler(id) {
        Modal.confirm({
            title: '提示',
            content: '确定删除？',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                axios.post('/survey/question/delete', {id: id})
                    .then((res)=>{
                        if (0 !== res.data.error.returnCode) {
                            message.error(res.data.error.returnUserMessage);
                        }
                        message.error('删除成功！');
                        this.props.refresh();
                    })
                    .catch(function (error) {
                        message.error('服务异常，请稍后在试！');
                    });
            }
        });
    }
    upHandler(id){
        axios.post('/survey/question/move', {id: id, direction: 'up'})
            .then((res)=>{
                if (0 !== res.data.error.returnCode) {
                    message.error(res.data.error.returnUserMessage);
                }
                this.props.refresh();
            })
            .catch(function (error) {
                message.error('服务异常，请稍后在试！');
            });
    }
    downHandler(id){
        axios.post('/survey/question/move', {id: id, direction: 'down'})
            .then((res)=>{
                if (0 !== res.data.error.returnCode) {
                    message.error(res.data.error.returnUserMessage);
                }
                this.props.refresh();
            })
            .catch(function (error) {
                message.error('服务异常，请稍后在试！');
            });
    }
    addQuesBtn(){
        return (
            <Button
                type="primary"
                size="small"
                onClick={()=>this.setState({targetToNewAddPage: true})}
            >新增问题</Button>
        )
    }
    render() {

        if(this.state && this.state.targetToNewAddPage) {
            return <Redirect to={`/surveyManage/detail/question/add`} />
        }

        if(this.state && this.state.targetToModifyPage) {
            return <Redirect to={`/surveyManage/detail/question/modify/${this.state.id}`} />
        }

        // 缓存list 长度
        this.len = this.props.dataSource ? this.props.dataSource.length : 0;

        return (
            <Card type="inner" title="问题列表" extra={this.addQuesBtn()}>
                <Table
                    rowKey="id"
                    pagination={false}
                    dataSource={this.props.dataSource}
                    columns={this.columns}
                />
            </Card>
        )
    }
}
