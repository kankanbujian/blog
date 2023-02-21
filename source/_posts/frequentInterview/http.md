# http


## 三次握手

client                                                              service

->       sync=1（创建连接标识位） sequenceId=a（随机串）申请建立连接
        ask=(a+1) sync=1 sequenceId=b   验证信息通过，允许连接   <-
->      aks={b+1} sync=1


## 四次挥手


client                                                                          service

->  Fin_Wait_1     Fin=1（断开链接标识位） sequenceId=a（随机串）申请建立连接  
        ask=(a+1) Fin=1 sequenceId=b   好的，知道了我看一下是否可以断开      <-      CLOSE_WAIT(不能再接受了，但是可以继续发)
    FIN_WAIT_2（已发完关闭申请，等待后断确认关闭）   Fin=1 sequenceId=b   ok，我这边准备好了，可以断开链接了      <-  LAST_ACK（无法接受和发送）             
-> （等待一段时间后自动断开）  收到，无需再发，可以断开了 aks={b+1}                             (收到后断开)Closed


## https
s即为security，也就是安全的http，http的传输层连接介于tcp协议，为了保证安全也就是加了一层ssl/stl协议，ssl相当于在http和tcp之间加了一层加密和解密服务协议。

