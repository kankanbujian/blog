---
title: Form
date: 2020-11-25 23:48:41
tags: 手写系列
catecories:
    - [手写系列]
---


# Form

这里主要针对antd4之后的Form组件，跟之前的使用方式最大有两个改变
1、不需要使用Form.create去创建一个高阶组件来拥有form属性。
2、不需要使用form.getDecorator()去维护FormItem内部的状态。

对于第一点class组件可以直接通过formRef，函数式组件可以通过useForm来拿到form实例对象，从而获取组件提供的所有方法;
对于第二点form的表单项使用方式直接优化成了

```javascript
    <Form.Item name='itemName'>
        <input/>
    </Form.Item>
```

现在思考一下怎么设计这个组件，首先组件内部会有一个状态管理器，用于管理内部所有的Item的状态变化。

``` js
    class FormStore {
        constructor(props) {
            super(props);
            this.formStore = {};
        }

        getFieldValue = (key) => {
            return this.formStore[key];
        }

        setFieldsValue = (newStore) => {
            this.formStore = {...this.formStore, ...newStore};
        }
        
        getFieldsValue = () => {
            return this.formStore;
        }

        getForm = () => {
            return {
                getFieldValue: this.getFieldValue,
                setFieldsValue: this.setFieldsValue,
                getFieldsValue: this.getFieldsValue
            }
        }
    }
```

我们可以通过useForm或者class的form属性获取到form实例方法。useForm是一个自定义hook，所以考虑到每个状态管理都是唯一绑定在一个Form上的，所以我们需要一个单例对象，既然使用了hooks那么很自然就是用于函数式组件，我们可以想到用useRef定义一个实例对象，对于useRef可以返回一个存在当前组件存在的整个生命周期，引用唯一。

```js
    // useForm.js
    const useForm = () => {
        const formInstance = useRef();
        if (!formInstance.current) {
            const formStore = new FormStore();
            formInstance.current = getForm();
        }
        return [formInstance];
    }
```

现在让我们将我们的FormItem和我们的formStore关联起来吧，首先考虑一下Form和FormItem，无论FormItem嵌套多少层我们都需要能够拿到公共的formInstance方法。所以自然能想到使用React的上下文。

```js
    // FormContext.js
    const FormContext = React.createContext(Symbol('FormContext'));
    export FormContext;
```

```js
    // Form.js
    import FormContext from './FormContext';
    import useForm form './useForm';
    const Form = ({children}) => {
        const formInstance = useForm();
        return <form>{
            <FormContext.Provider value={formInstance}>
            {
                children
            }
            </FormContext.Provider>
        }</form>
    }
```

```js
    // FormItem.js
    import FormContext from './FormContext';
    class FormItem extends Component {
        static contextType = FormContext;

        constructor(props) {
            super(props);
        }

        render() {
            const {children, name} = props;
            const {getFieldValue, getFieldsValue, setFieldsValue} = this.context
            // 复制一个子组件，给其增加value和onChange属性, 这里我们以为Input为例，其他如Checkbox，Select也可根据进行相应逻辑处理
            // 我们需要拿到
            const elm = React.clone(children, {
                value: getFieldValue(name),
                onChange: (e) => {
                    setFieldsValue({
                        [name]: e.target.value
                    })
                }
            })
            return {elm};
        }
    }
```

这时候我们已经通过FormItem返回了一个高阶组件，其自动将FormItem内部的表单组件自动注入了我们需要的value和onChange，但是现在我们能发现，当onChange的时候，store执行了setFieldsValue方法，但是FormItem没有进行渲染，所以我们需要在setFieldsValue时将对应的FormItem更新，setFieldsValue跟FormItem关联的地方在于store的key和FormItem的name属性，当FormItem的name在store中更新的属性名中，则该FormItem需要重新渲染。
onChange=> formstore.setFieldsValue => formItem.forceUpdate => value={formstore.getFieldsValue}

```js
    // useForm.js
    class FormStore {
        constructor(props) {
            ...
            this.fieldEntities = [];
            ...
        }

        registerEntity = (entity) => {
            this.fieldEntities.push(entity);
        }

        setFieldsValue = (newValues) => {
            ...
            for (let key in newValues) {
                this.fieldEntities.forEach(_entity => {
                    if (_entity.props.name === key) {
                        _entity.onFieldValueChange();
                    }
                })
            } 
            ...
        }
        ...
    }
```

```js
    // FormItem.js
    class FormItem extends Component {
        ...
        componentDidMount() {
            const formInstance = this.context;
            instance.registerEntity(this);
        }

        onFieldValueChange() {
            this.forceUpdate()
        }
    }
    
```

这样一个简单版的Form组件就实现了，代码和逻辑看下来其实很清晰，但是其中用到的自定义hooks，store，formitem组件内部的自动注入，value和onchange的双向绑定都值得我们思考和学习的，仓库传送门: https://github.com/kankanbujian/handwriting-series/tree/master/my-form。
