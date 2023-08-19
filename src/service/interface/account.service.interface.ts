import {
  CheckBalanceDto,
  CreateDto,
  DepositDto,
  VerifyDto,
  WithdrawDto,
} from "../../controller/interface/dto";
import {
  CreateResponse,
  VerifyResponse,
} from "../../controller/interface/response.interface";

export interface AccountInterface {
  create(createDto: CreateDto): Promise<CreateResponse>;
  verify(verifyDto: VerifyDto): Promise<VerifyResponse>;
  withdraw(withdrawDto: WithdrawDto): Promise<void>;
  deposit(depositDto: DepositDto): Promise<void>;
  checkBalance(checkBalanceDto: CheckBalanceDto): Promise<number>;
}
