CREATE TABLE t_category (
  id uuid NOT NULL,
  created_at timestamp(6) with time zone,
  name varchar(255) NOT NULL,
  transaction_type varchar(255) NOT NULL,
  updated_at timestamp(6) with time zone,
  CONSTRAINT t_category_pkey PRIMARY KEY (id),
  CONSTRAINT t_category_name_key UNIQUE (name),
  CONSTRAINT t_category_transaction_type_check CHECK (
    transaction_type IN ('INCOME', 'EXPENSE')
  )
);

CREATE TABLE t_role (
  id uuid NOT NULL,
  created_at timestamp(6) with time zone,
  role_name varchar(255) NOT NULL,
  updated_at timestamp(6) with time zone,
  CONSTRAINT t_role_pkey PRIMARY KEY (id),
  CONSTRAINT t_role_role_name_key UNIQUE (role_name),
  CONSTRAINT t_role_role_name_check CHECK (
    role_name IN ('ROLE_ADMIN', 'ROLE_USER')
  )
);

CREATE TABLE t_user (
  id uuid NOT NULL,
  created_at timestamp(6) with time zone,
  email varchar(255) NOT NULL,
  name varchar(50),
  password varchar(255),
  updated_at timestamp(6) with time zone,
  CONSTRAINT t_user_pkey PRIMARY KEY (id),
  CONSTRAINT t_user_email_key UNIQUE (email)
);

CREATE TABLE t_refresh_token (
  id uuid NOT NULL,
  created_at timestamp(6) with time zone,
  expiry_date timestamp(6) with time zone NOT NULL,
  token varchar(255) NOT NULL,
  updated_at timestamp(6) with time zone,
  user_id uuid,
  CONSTRAINT t_refresh_token_pkey PRIMARY KEY (id),
  CONSTRAINT t_refresh_token_token_key UNIQUE (token),
  CONSTRAINT t_refresh_token_user_id_key UNIQUE (user_id),
  CONSTRAINT t_refresh_token_user_id_fkey FOREIGN KEY (user_id) REFERENCES t_user(id)
);

CREATE TABLE t_saving (
  id uuid NOT NULL,
  amount numeric(19, 2) NOT NULL,
  created_at timestamp(6) with time zone,
  location varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  updated_at timestamp(6) with time zone,
  user_id uuid NOT NULL,
  CONSTRAINT t_saving_pkey PRIMARY KEY (id),
  CONSTRAINT t_saving_user_id_fkey FOREIGN KEY (user_id) REFERENCES t_user(id),
  CONSTRAINT t_saving_location_check CHECK (
    location IN (
      'CASH',
      'CHECKING_ACCOUNT',
      'SAVINGS_ACCOUNT',
      'INVESTMENT',
      'OTHER'
    )
  )
);

CREATE TABLE t_transaction (
  id uuid NOT NULL,
  created_at timestamp(6) with time zone,
  date date NOT NULL,
  installment_numbers integer,
  notes varchar(255),
  repeats varchar(255),
  total_value numeric(38, 2) NOT NULL,
  updated_at timestamp(6) with time zone,
  category_id uuid NOT NULL,
  user_id uuid NOT NULL,
  CONSTRAINT t_transaction_pkey PRIMARY KEY (id),
  CONSTRAINT t_transaction_category_id_fkey FOREIGN KEY (category_id) REFERENCES t_category(id),
  CONSTRAINT t_transaction_user_id_fkey FOREIGN KEY (user_id) REFERENCES t_user(id),
  CONSTRAINT t_transaction_installment_numbers_check CHECK (
    installment_numbers <= 500
    AND installment_numbers >= 2
  ),
  CONSTRAINT t_transaction_repeats_check CHECK (
    repeats IN ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'NONE')
  )
);

CREATE TABLE t_installment (
  id uuid NOT NULL,
  amount numeric(38, 2) NOT NULL,
  created_at timestamp(6) with time zone,
  due_date date NOT NULL,
  installment_number integer NOT NULL,
  total_installments integer NOT NULL,
  updated_at timestamp(6) with time zone,
  transaction_id uuid NOT NULL,
  CONSTRAINT t_installment_pkey PRIMARY KEY (id),
  CONSTRAINT t_installment_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES t_transaction(id)
);

CREATE TABLE t_user_image (
  id uuid NOT NULL,
  name varchar(255),
  profile_image oid,
  type varchar(255),
  user_id uuid,
  CONSTRAINT t_user_image_pkey PRIMARY KEY (id),
  CONSTRAINT t_user_image_user_id_key UNIQUE (user_id),
  CONSTRAINT t_user_image_user_id_fkey FOREIGN KEY (user_id) REFERENCES t_user(id)
);

CREATE TABLE t_user_roles (
  user_id uuid NOT NULL,
  role_id uuid NOT NULL,
  CONSTRAINT t_user_roles_pkey PRIMARY KEY (user_id, role_id),
  CONSTRAINT t_user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES t_user(id),
  CONSTRAINT t_user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES t_role(id)
);

INSERT INTO
  t_role (id, role_name, created_at, updated_at)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'ROLE_ADMIN',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'ROLE_USER',
    now(),
    now()
  );
