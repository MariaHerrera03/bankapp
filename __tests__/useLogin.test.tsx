import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { DEV_CREDENTIALS, DEV_USER } from '../shared/theme/devData';
import { useLogin } from '../react-native-bundles/login-bundle/src/hooks/useLogin';

interface LoginHarnessProps {
  onSuccess: jest.Mock;
  onReady: (login: ReturnType<typeof useLogin>) => void;
}

function LoginHarness({ onSuccess, onReady }: LoginHarnessProps) {
  const login = useLogin(onSuccess);
  onReady(login);
  return null;
}

async function createLoginHarness(onSuccess = jest.fn()) {
  let currentLogin!: ReturnType<typeof useLogin>;
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <LoginHarness
        onSuccess={onSuccess}
        onReady={login => {
          currentLogin = login;
        }}
      />,
    );
  });
  return { renderer, getLogin: () => currentLogin };
}

afterEach(() => jest.useRealTimers());

test('submit with empty fields shows validation without authenticating', async () => {
  const login = await createLoginHarness();

  await ReactTestRenderer.act(async () => {
    await login.getLogin().submit();
  });

  expect(login.getLogin().error).toBe('Completa usuario y contraseña.');
  expect(login.getLogin().loading).toBe(false);
  await ReactTestRenderer.act(async () => {
    login.renderer.unmount();
  });
});

test('submit with incorrect credentials shows the auth error', async () => {
  const login = await createLoginHarness();

  await ReactTestRenderer.act(async () => {
    login.getLogin().setUsername('wrong');
    login.getLogin().setPassword('wrong');
  });
  await ReactTestRenderer.act(async () => {
    await login.getLogin().submit();
  });

  expect(login.getLogin().error).toBe('Usuario o contraseña incorrectos.');
  await ReactTestRenderer.act(async () => {
    login.renderer.unmount();
  });
});

test('submit with development credentials calls onSuccess with the expected session', async () => {
  const onSuccess = jest.fn();
  const login = await createLoginHarness(onSuccess);

  await ReactTestRenderer.act(async () => {
    login.getLogin().setUsername(DEV_CREDENTIALS.username);
    login.getLogin().setPassword(DEV_CREDENTIALS.password);
  });
  await ReactTestRenderer.act(async () => {
    await login.getLogin().submit();
  });

  expect(onSuccess).toHaveBeenCalledWith(
    expect.objectContaining({
      userId: DEV_USER.userId,
      name: DEV_USER.name,
      phone: DEV_USER.phone,
    }),
  );
  expect(login.getLogin().error).toBe('');
  await ReactTestRenderer.act(async () => {
    login.renderer.unmount();
  });
});
