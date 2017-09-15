SOLC=solc
S_FLAGS=--optimize --overwrite --abi --bin
CONTRACT_PATH=./contracts
OUTPUT=./compiledContracts

all: bind contract

bind:
	${SOLC} ${S_FLAGS} ${CONTRACT_PATH}/bind.sol -o ${OUTPUT} 

contract:
	${SOLC} ${S_FLAGS} ${CONTRACT_PATH}/contract.sol -o ${OUTPUT} 

clean:
	rm -Rf ./compiledContracts
