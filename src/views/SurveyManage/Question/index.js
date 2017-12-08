import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { Modal, Form, Input, Button, Card, message, Checkbox, Col, Row, Select, Icon, InputNumber } from 'antd';
import './index.less';

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
            options: [{}]
        }
    }
    resultDecorator(values){
        let result = {
            surveyId: values.surveyId,
            category: values.category,
            title: values,
            isRequired: values.isRequired,
            options: []
        }
        let options = result.options;

        for (let i = 0, len = this.state.options.length; i < len; i++) {
            options.push({
                optionTitle: getFieldValueBy('optionTitle', i),
                jumpTo: getFieldValueBy('jumpTo', i),
                optionHasInput: getFieldValueBy('optionHasInput', i),
                optionJump: getFieldValueBy('optionJump', i),
                score: getFieldValueBy('score', i)
            })
        }

        return result;

        function getFieldValueBy(field, index) {
            return values[`${field}-${index}`];
        }
    }
    submit(){
        this.props.form.validateFields((errors, values) => {
            console.log(this.state.options)
            console.log(errors, values);
            if (errors) {
                return;
            }
            console.log(this.resultDecorator(values));
                /**
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
                 **/
        });
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
            </div>
        )
    }

    /**
     * @index 当前问题选项行索引
     * 在当前问题选项下增加一个选项
     */
    plusOptionHandler(index) {
        this.state.options.splice(index, 0, {});
        this.setState({});
    }

    /**
     * @index 当前问题选项行索引
     * 在当前问题选项下增加一个选项
     */
    minusOptionHandler(index) {
        console.log(index);
        Modal.confirm({
            title: '提示',
            content: '确定删除？',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                this.state.options.splice(index, 1);
                this.setState({});
            }
        });

    }

    renderPage(questionId=this.props.match.params.id){
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
    componentWillMount(){
        this.renderPage(this.props.match.params.id);
    }
    render() {
        let getFieldDecorator = this.props.form.getFieldDecorator;

        if(this.state.addSuccess) {
            return <Redirect to="/surveyManage/list"/>
        }

        const isAdd = this.props.match.params.method === 'add' ? true : false;

        const formItems = this.state.options.map((item, index) => {
            return (
                <FormItem
                    label="选项"
                    {...formItemLayout}
                    key={index}
                    style={{marginBottom: 0}}
                >
                    <FormItem
                        style={{display:'inline-block', marginRight: '10px'}}
                    >
                        {getFieldDecorator(`optionTitle-${index}`, {
                            initialValue: 1,
                            rules: []
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        style={{display:'inline-block', marginRight: '10px'}}
                    >
                        <Icon
                            style={{marginRight: '5px'}}
                            className="dynamic-delete-button"
                            type="plus-circle-o"
                            onClick={() => this.plusOptionHandler(index)}
                        />
                        {this.state.options.length !== 1 &&
                            <Icon
                                className="dynamic-delete-button"
                                type="minus-circle-o"
                                style={{marginRight: '5px'}}
                                onClick={() => this.minusOptionHandler(index)}
                            />
                        }
                        <Button
                            style={{marginRight: '5px'}}
                            type="primary"
                            size="sm"
                        >高级编辑</Button>
                    </FormItem>
                    <FormItem
                        style={{display:'inline-block', marginRight: '10px'}}
                    >
                        {getFieldDecorator(`optionHasInput-${index}`, {
                            valuePropName: 'checked',
                            initialValue: item.optionHasInput ? true : false,
                            rules: []
                        })(
                            <Checkbox>允许填空</Checkbox>
                        )}
                    </FormItem>
                    <FormItem
                        style={{display:'inline-block', marginRight: '10px'}}
                    >
                        {getFieldDecorator(`optionJump-${index}`, {
                            valuePropName: 'checked',
                            initialValue: item.optionJump ? true : false,
                            rules: []
                        })(
                            <Checkbox>跳转</Checkbox>
                        )}
                    </FormItem>
                    <FormItem
                        style={{display:'inline-block', marginRight: '10px'}}
                    >
                        {getFieldDecorator(`jumpTo-${index}`, {
                            initialValue: item.jumpTo,
                            rules: []
                        })(
                            <Select
                                style={{width: '120px'}}
                            >
                                {
                                 this.state.sequences && this.state.sequences.map((obj)=>{
                                        return (
                                            <Option value={obj.sequence} title={obj.title}>{obj.title}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...{
                            labelCol: {
                                sm: {span: 10}
                            },
                            wrapperCol: {
                                sm: {span: 12}
                            }
                        }}
                        label="分数"
                        style={{display:'inline-block', marginRight: '10px'}}
                    >
                        {getFieldDecorator(`score-${index}`, {
                            initialValue: 0,
                            rules: []
                        })(
                            <InputNumber />
                        )}
                    </FormItem>
                </FormItem>

            )
        });

        return (
            <div>
                <Card title={isAdd ? '新增问题' : '修改问题'} extra={this.groupBtns(isAdd)}>
                    <Form>
                        <FormItem
                            label="类型"
                            {...formItemLayout}
                        >
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
                                        <input type="checkbox" />                                )}
                                </FormItem>
                            </Col>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="题目"
                        >
                            {getFieldDecorator('title', {
                                initialValue: this.state.title,
                                rules: []
                            })(
                                <TextArea />
                            )}
                        </FormItem>
                        {formItems}
                    </Form>
                </Card>
            </div>
        )
    }
}

export default Form.create()(Detail);
