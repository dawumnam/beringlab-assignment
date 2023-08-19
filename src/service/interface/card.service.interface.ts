import {
  DisableDto,
  EnableDto,
  RegisterDto,
} from "../../controller/interface/dto";
import { RegisterResponse } from "../../controller/interface/response.interface";

export interface CardService {
  register(registerDto: RegisterDto): Promise<RegisterResponse>;
  enableCard(enableDto: EnableDto): Promise<void>;
  disableCard(disableDto: DisableDto): Promise<void>;
}
