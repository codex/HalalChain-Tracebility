/*
@author: lau
@email: laulucky@126.com
@date: 2018/2/7
 */
package main

import (
	"hlccc/control"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

func main() {
	err := shim.Start(new(control.ProductTrace))
	if err != nil {
		fmt.Printf("Error starting ProductTrace: %s", err)
	}
}
