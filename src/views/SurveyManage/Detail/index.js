import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';
import QuestionList from './list.js';

const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
    labelCol: {
        sm: { span: 4 }
    },
    wrapperCol: {
        sm: { span: 8 }
    },
};

class Detail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            addSuccess: false
        }
    }

    submit(){
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                return;
            }
            axios.post('/survey/createSurvey', values)
                .then((res)=>{
                    if (0 !== res.data.error.returnCode) {
                        message.error(res.data.error.returnUserMessage);
                    }
                    message.error('添加成功！');
                    this.setState({addSuccess: true});
                })
                .catch(function (error) {
                    message.error('服务异常，请稍后在试！');
                });
        });
    }
    preview(){

    }
    publish(){

    }

    /**
     * isAdd boolean 页面可以是新增或者编辑
     *
     * @returns {react-dom}
     */
    groupBtns(isAdd){
        return (
            <div>
                <Button
                    type="primary"
                    size="small"
                    style={{marginRight: '5px'}}
                    onClick={this.submit.bind(this)}
                >提交</Button>
                {!isAdd &&
                    <span>
                        <Button
                            type="primary"
                            size="small"
                            style={{marginRight: '5px'}}
                            onClick={this.preview.bind(this)}>预览</Button>
                        <Button
                            type="primary"
                            size="small"
                            style={{marginRight: '5px'}}
                            onClick={this.publish.bind(this)}>发布</Button>
                    </span>
                }
            </div>
        )
    }
    renderPage(surveyId = this.props.match.params.id){
        axios.post('/survey/surveyModify', {surveyId})
            .then((res)=>{
                if(0 !== res.data.error.returnCode) {
                    message.error(res.data.error.returnUserMessage);
                    return;
                }
                let data = res.data.data;
                this.setState({...data});
            })
            .catch(function (error) {
                message.error('服务异常，请稍后在试！');
            });
    }
    componentWillMount(){
        this.renderPage();
    }
    render() {
        if(this.state.addSuccess) {
            return <Redirect to="/surveyManage/list"/>
        }

        const isAdd = this.props.match.params.method === 'add' ? true : false;
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
                <Card title={isAdd ? '新增问卷' : '修改问卷'} extra={this.groupBtns(isAdd)}>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="问卷名称"
                        >
                            {getFieldDecorator('subject', {
                                initialValue: this.state.subject,
                                rules: [{
                                    required: true, message: ''
                                }],
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="欢迎语"
                        >
                            {getFieldDecorator('welcome', {
                                initialValue: this.state.welcome,
                                rules: []
                            })(
                                <TextArea />
                            )}
                        </FormItem>
                    </Form>
                    {!isAdd && <QuestionList refresh={()=>this.renderPage()} dataSource={this.state.question}/>}
                </Card>
            </div>
        )
    }
}

export default Form.create()(Detail);
