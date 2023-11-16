import userInfo from '../stubs/user-info-dto.stub.js';

const UserInfoServiceMock = jest.fn().mockReturnValue({
  createUserInfo: jest.fn().mockReturnValue(userInfo),
  updateUserInfo: jest.fn().mockReturnValue(userInfo()),
  getUserInfo: jest.fn().mockReturnValue(userInfo()),
});

export default UserInfoServiceMock;
