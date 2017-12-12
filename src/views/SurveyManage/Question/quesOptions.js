import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import CKEditor from '../../components/ckEditor';
import html2text from './html2text';
import {
    Modal,
    Form,
    Input,
    Button,
    Checkbox,
    Col,
    Row,
    Select,
    Icon,
    InputNumber
} from 'antd';


const FormItem = Form.Item;
const Option = Select.Option;

class QuesOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionEditorDialogVisible: false,
            optionEditorDialogContent: ''
        }
    }
    noopQuesOptionItem (){
        return {};
    }

    resultDecorator(values){
        let result = [];

        for (let i = 0, len = this.props.options.length; i < len; i++) {
            result.push({
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

    /**
     * @index 当前问题选项行索引
     * 在当前问题选项下增加一个选项
     */
    plusOptionHandler(index) {
        this.props.options.splice(index + 1, 0, this.noopQuesOptionItem());
        this.setState({});
    }

    /**
     * @index 当前问题选项行索引
     * 在当前问题选项下增加一个选项
     */
    minusOptionHandler(index) {
        Modal.confirm({
            title: '提示',
            content: '确定删除？',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                this.props.options.splice(index, 1);
                this.setState({});
            }
        });

    }

    openOptionEditorHandler(index) {
        this.setState({
            optionEditorDialogVisible: true,
            curOpenedOptionIndex: index,
            optionEditorDialogContent: this.props.form.getFieldValue(`optionTitle-${index}`)
        });
    }

    optionList() {
        let getFieldDecorator = this.props.form.getFieldDecorator;
        let options = this.props.options;

        return options.map((item, index) => (
            <FormItem
                label="选项"
                labelCol= {{
                    sm: {span: 2}
                }}
                wrapperCol= {{
                    sm: {span: 22}
                }}
                key={index}
                style={{marginBottom: 0}}
            >
                <FormItem style={{display:'inline-block', marginRight: '10px'}}>
                    {getFieldDecorator(`optionTitle-${index}`, {
                        initialValue: html2text(item.optionTitle),
                        rules: []
                    })(
                        <Input readOnly onClick={() => this.openOptionEditorHandler(index)} />
                    )}
                </FormItem>

                <FormItem style={{display:'inline-block', marginRight: '10px'}}>
                    <Icon
                        style={{marginRight: '5px'}}
                        className="dynamic-delete-button"
                        type="plus-circle-o"
                        onClick={() => this.plusOptionHandler(index)}
                    />
                    {options.length !== 1 &&
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            style={{marginRight: '5px'}}
                            onClick={() => this.minusOptionHandler(index)}
                        />
                    }
                </FormItem>

                <FormItem style={{display:'inline-block', marginRight: '10px'}}>
                    {getFieldDecorator(`optionHasInput-${index}`, {
                        valuePropName: 'checked',
                        initialValue: item.optionHasInput ? true : false,
                        rules: []
                    })(
                        <Checkbox>允许填空</Checkbox>
                    )}
                </FormItem>

                <FormItem style={{display:'inline-block', marginRight: '10px'}}>
                    {getFieldDecorator(`optionJump-${index}`, {
                        valuePropName: 'checked',
                        initialValue: item.optionJump ? true : false,
                        rules: []
                    })(
                        <Checkbox>跳转</Checkbox>
                    )}
                </FormItem>

                <FormItem style={{display:'inline-block', marginRight: '10px'}}>
                    {getFieldDecorator(`jumpTo-${index}`, {
                        initialValue: item.jumpTo,
                        rules: []
                    })(
                        <Select style={{width: '120px'}}>
                            {
                                this.props.sequences && this.props.sequences.map((obj)=>{
                                    let title = `${obj.sequence}-${html2text(obj.title)}`;
                                    return (
                                        <Option value={obj.sequence} title={title}>{title}</Option>
                                    )
                                })
                            }
                        </Select>
                    )}
                </FormItem>

                <FormItem
                    labelCol= {{
                        sm: {span: 10}
                    }}
                    wrapperCol= {{
                        sm: {span: 12}
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
        ));
    }

    render() {
        return (
            <div>
                {this.optionList()}

                <Modal
                    title="高级编辑"
                    visible={this.state.optionEditorDialogVisible}
                    onCancel={()=>this.setState({optionEditorDialogVisible: false})}
                    onOk={()=>{
                        let data = this.optionEditorDialog.getData();
                        let fields = {};
                        fields[`optionTitle-${this.state.curOpenedOptionIndex}`] = data;
                        this.props.form.setFieldsValue(fields);
                        this.setState({optionEditorDialogVisible: false})
                    }}
                >
                    <CKEditor
                        ref={(editor) => this.optionEditorDialog = editor}
                        content={this.state.optionEditorDialogContent} />
                </Modal>
            </div>
        )
    }
}

export default Form.create()(QuesOptions);
