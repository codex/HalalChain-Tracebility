/*
@author: lau
@email: laulucky@126.com
@date: 2018/2/7
 */
package log

import "github.com/hyperledger/fabric/core/chaincode/shim"

var Logger *shim.ChaincodeLogger

func init() {
	Logger = shim.NewLogger("ProductTrace")
	Logger.SetLevel(shim.LogCritical)
	Logger.IsEnabledFor(shim.LogCritical)
}
