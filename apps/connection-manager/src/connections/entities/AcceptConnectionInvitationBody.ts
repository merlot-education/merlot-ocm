import { ApiProperty } from '@nestjs/swagger';

export default class AcceptConnectionInvitationBody {
  @ApiProperty()
  public invitationUrl: string;

  @ApiProperty()
  public autoAcceptConnection: boolean;
}
