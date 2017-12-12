import './index.less';
import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import CKEditor from '../../components/ckEditor';
import QuesOptions from './quesOptions';
import Breadcrumb from '../../components/breadcrumb';

import {
    Modal,
    Form,
    Input,
    Button,
    Card,
    message,
    Checkbox,
    Col,
    Row,
    Select,
    Icon,
    InputNumber
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const formItemLayout = {
    labelCol: {
        sm: {span: 2}
    },
    wrapperCol: {
        sm: {span: 22}
    }
};

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: 1, // 1-单选， 2-多选
            options: [this.noopQuesOptionItem()]
        }
    }
    noopQuesOptionItem (){
        return {};
    }
    resultDecorator(values){
        let result = {
            surveyId: values.surveyId,
            category: values.category,
            title: values.title,
            isRequired: values.isRequired ? 1 : 0,
            options: []
        }

        for (let i = 0, len = this.state.options.length; i < len; i++) {
            result.options.push({
                optionTitle: getFieldValueBy('optionTitle', i),
                jumpTo: getFieldValueBy('jumpTo', i),
                optionHasInput: getFieldValueBy('optionHasInput', i),
                optionJump: getFieldValueBy('optionJump', i),
                score: getFieldValueBy('score', i)
            })
        }

        return result;

        function getFieldValueBy(field, index) {
            let val = values[`${field}-${index}`];
            if(typeof  val === 'boolean') {
                return val ? 1 : 0;
            }

            return val;
        }
    }
    submit(){
        this.optionsForm.validateFields((optionsErrors, optionsValues) => {
            this.props.form.validateFields((errors, values) => {
                if (optionsErrors || errors) {
                    return;
                }

                values = Object.assign(values, optionsValues);
                values['title'] = this.titleEditor.getData();

                axios.post('/survey/question/createQuestion', values)
                    .then((res)=>{
                        if (0 !== res.data.error.returnCode) {
                            message.error(res.data.error.returnUserMessage);
                            return;
                        }
                        message.success('操作成功！');
                        this.setState({addSuccess: true});
                    })
                    .catch(function (error) {
                        message.error('服务异常，请稍后在试！');
                    });
            });
        });
    }

    componentWillMount(){
        let questionId = this.props.match.params.id;
        if (questionId === '0') {
            return;
        }

        axios.post('/survey/question/questionModify', {questionId})
            .then((res)=>{
                if(0 !== res.data.error.returnCode) {
                    message.error(res.data.error.returnUserMessage);
                    return;
                }
                let data = res.data.data;
                this.setState(data);
            })
            .catch(function (error) {
                message.error('服务异常，请稍后在试！');
            });
    }

    render() {
        const getFieldDecorator = this.props.form.getFieldDecorator;
        const isAdd = this.props.match.params.id === '0' ? true : false;

        if(this.state.addSuccess) {
            return <Redirect to={`/surveyManage/detail/${this.props.match.params.detailId}`}/>
        }
        return (
            <div>
                <Breadcrumb routes={[
                    {path: '/surveyManage/list', name: '问卷列表'},
                    {path: `/surveyManage/detail/${this.props.match.params.detailId}`, name: '问卷详情'},
                    {path: '', name: isAdd ? '新增问题' : '修改问题'}
                ]} />
                <Card title={isAdd ? '新增问题' : '修改问题'} extra={
                    <Button
                        type="primary"
                        size="small"
                        style={{marginRight: '5px'}}
                        onClick={this.submit.bind(this)}
                    >提交</Button>
                }>
                    <Form>
                        <FormItem label="类型" {...formItemLayout}>
                            <Col span={5}>
                                <FormItem >
                                {getFieldDecorator('category', {
                                    initialValue: this.state.category,
                                    rules: []
                                })(
                                    <Select>
                                        <Option value={1}>单选</Option>
                                        <Option value={2}>多选</Option>
                                    </Select>
                                )}
                                </FormItem>
                            </Col>
                            <Col span={11} offset={1}>
                                <FormItem >
                                    {getFieldDecorator('isRequired', {
                                        valuePropName: 'checked',
                                        initialValue: this.state.isRequired ? true : false
                                    })(
                                        <Input type="checkbox" />
                                    )}
                                </FormItem>
                            </Col>
                        </FormItem>
                        <FormItem {...formItemLayout} label="题目">
                            {getFieldDecorator('title', {
                                initialValue: this.state.title,
                                rules: []
                            })(
                                <Input type="hidden" />
                            )}
                            <CKEditor
                                ref={editor => this.titleEditor = editor}
                                content={this.state.title}
                            />
                        </FormItem>
                        <QuesOptions
                            ref={(quesOption)=>{
                                this.optionsForm = quesOption;
                            }}
                            options={this.state.options}
                            sequences={this.state.sequences} />
                    </Form>
                </Card>
            </div>
        )
    }
}

export default Form.create()(Detail);
