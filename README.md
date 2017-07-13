# shimo-navigation

石墨文档 React Native app 导航系统

---------------------


基于 react-navigation 的修改内容记录：

### StackRouter:
1. 修改了 route.key 的生成规则，由之前随机生成 uuid 改为:通过 Screen.screenKey 的静态方法生成 key ，或取 routeName 作为 key(方便 goBack 指定参数)
2. 禁止了具有相同 key 的 navigate 操作

### StackNavigator:
1. navigator 的 dispatch 方法里面 nav state 的设置改为同步读写

### Transitioner:
1. _startTransition 在进行 reset 操作的时候禁止了不必要的动画

### CardStackTransitioner:
1. _render 渲染场景的时候获取 transition blur 与 focus 的路由名，并传入 CardStack 的 transitionTargets prop 中

### CardStack:
1. 只有最顶层的 navigator 才支持手势
2. 拓展了传入 screen 的 navigation prop 结构
```
{
    ...navigation,
    position, // 转场动画的位置
    progress, // 转场动画的进度
    status: {
        isActive: boolean, // 是否是当前活跃的场景
        isStale: boolean, // 是否是正在退出的场景
        isResponding: boolean, // 是否处于在进行手势返回操作
        isFocusing: boolean, // 是否处于转入动画过程中
        isBlurring: boolean // 是否处于转出动画过程中
    }
}
```

3. 支持在 screen navigation options 内指定当前 screen 的 mode
4. 支持在 screen navigation options 内指定当前 screen 的 gesturesEnabled

```
class SomeScreen extends Component {
  static navigationOptions = {
    mode: 'card',
    gesturesEnabled: false
  };
}
```