INSERT INTO
  t_user (id, name, email, password, created_at, updated_at)
SELECT
  '00000000-0000-0000-0000-000000000100',
  NULLIF('${seed_user_name}', ''),
  '${seed_user_email}',
  '${seed_user_password_hash}',
  now(),
  now()
WHERE
  '${seed_user_email}' <> ''
  AND '${seed_user_password_hash}' <> ''
ON CONFLICT (email) DO UPDATE
SET
  name = COALESCE(EXCLUDED.name, t_user.name),
  password = EXCLUDED.password,
  updated_at = now();

INSERT INTO
  t_user_roles (user_id, role_id)
SELECT
  u.id,
  r.id
FROM
  t_user u
  JOIN t_role r ON r.role_name = 'ROLE_USER'
WHERE
  u.email = '${seed_user_email}'
  AND '${seed_user_email}' <> ''
  AND '${seed_user_password_hash}' <> ''
ON CONFLICT DO NOTHING;
