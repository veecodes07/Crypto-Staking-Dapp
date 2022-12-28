
        const Tether = artifacts.require("Tether");
        const RWD = artifacts.require("RWD");
        const DecentralBank = artifacts.require("DecentralBank");

    require('chai')
    .use(require('chai-as-promised'))
    .should()

    contract('DecentralBank', ([owner, customer]) => {
        let tether, rwd, decentralBank

        function tokens(number) {
            return web3.utils.toWei(number, 'ether')
        }

        before(async () => {
            //Load contracts
            tether = await Tether.new()
            rwd = await RWD.new()
            decentralBank = await DecentralBank.new(rwd.address, tether.address)

            //Transfer all tokens to DecentralBank (1 million)
            await rwd.transfer(decentralBank.address, tokens('1000000') )

            //TRANSFER 100 MOCK TETHER TO CUSTOMER
            await tether.transfer(customer, tokens('100'), {from:owner})
        })
        //all of code goes here for testing
        describe('Mock Tether Deployment', async () => {
            it('matches name successfully', async () => {
               
                const name = await tether.name()
                assert.equal(name, 'Tether')
            })
        })
        describe('Reward Token Deployment', async () => {
            it('matches name successfully', async () => {
              
                const name = await rwd.name()
                assert.equal(name, 'Reward Token')
            })
        })
        describe('DecentralBank Deployment', async () => {
            it('matches name successfully', async () => {
                const name = await decentralBank.name()
                assert.equal(name, 'DecentralBank')
            })
        })
        
               
        it('contract has tokens', async () => {
            balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        })

        describe('Yeild Farming', async () => {
            it('rewards tokens for staking', async() => {
                let result

                //check investor balance
                result = await tether.balanceOf(customer)
                assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance before staking')

                //check staking for customer
                await tether.approve(decentralBank.address, tokens('100'), {from: customer})
                await decentralBank.depositTokens(tokens('100'), {from: customer})

                //check updated balance of customer
                result = await tether.balanceOf(customer)
                assert.equal(result.toString(), tokens('0'), 'customer mock wallet balance after staking')

                //check updated balance of decentralBank
                result = await tether.balanceOf(decentralBank.address)
                assert.equal(result.toString(), tokens('100'), 'decentralbank wallet balance after staking')

                //is staking update
                result = await decentralBank.isStaking(customer)
                assert.equal(result.toString(), 'true', 'customer is staking status after staking')

                //Issue Tokens
                await decentralBank.issueTokens({from: owner})

                //Ensure Only Owner Can Issue Tokens
                await decentralBank.issueTokens({from: customer}).should.be.rejected;

                //Unstake tokens
                await decentralBank.unstakeTokens({from: customer})

                //check unstaking balances
                result = await tether.balanceOf(customer)
                assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance after unstaking')

                //check updated balance of decentralBank
                result = await tether.balanceOf(decentralBank.address)
                assert.equal(result.toString(), tokens('0'), 'decentralbank wallet balance after staking')

                //is staking update
                result = await decentralBank.isStaking(customer)
                assert.equal(result.toString(), 'false', 'customer is no longer staking status after unstaking')


            

            
            })
        })
        })

    