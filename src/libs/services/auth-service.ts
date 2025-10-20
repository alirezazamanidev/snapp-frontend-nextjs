export const checkLogin = async (token: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/check-login`,
    {
      headers: {
        Cookie: `snapp-session=${token}`,
      },
      cache: 'no-store',
    },
  );

  if (res.status !== 200) {
    return {
      isLoggedIn: false,
      user: null,
    };
  }
  const data = await res.json();
  return {
    isLoggedIn: true,
    user: data.user,
  };
};
