<?php require 'catalog_logic.php'; ?>
<?php require 'reviews.php'; ?>
<!DOCTYPE html>
<html lang="ru" data-bs-spy="scroll" data-bs-target="#mainNav" data-bs-offset="80" tabindex="0">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Behoof — поиск и сравнение электроники</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="stylee.css">
</head>
<body>

    <!-- ===== TOP BAR ===== -->
    <div class="header__top py-2">
        <div class="container">
            <div class="row align-items-center gy-2">
                <div class="col-auto">
                    <a href="#" class="logo text-decoration-none"><span class="logo__mark">B</span>ehoof</a>
                </div>
                <div class="col text-center">
                    <div class="d-flex flex-wrap justify-content-center gap-3 header__info">
                        <span class="info-item"><i class="bi bi-geo-alt me-1"></i> Москва</span>
                        <span class="info-item"><i class="bi bi-clock me-1"></i> Пн-Вс с 10:00 до 20:00</span>
                        <span class="info-item"><i class="bi bi-envelope me-1"></i> help@behoof.ru</span>
                    </div>
                </div>
                <div class="col-auto text-center text-md-end">
                    <a href="tel:+74950000000" class="header__phone text-decoration-none fw-bold">
                        <i class="bi bi-telephone me-2"></i>+7 495 000-00-00</a>
                </div>
            </div>
        </div>
    </div>

    <!-- ===== NAVBAR ===== -->
    <nav id="mainNav" class="navbar navbar-expand-lg header__bottom sticky-top">
        <div class="container">
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMenu">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0 align-items-center gap-lg-2">
                    <li class="nav-item"><a class="nav-link active" href="#hero">Главная</a></li>
                    <li class="nav-item"><a class="nav-link" href="#catalog">Каталог</a></li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Категории</a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="?category=smartphone#catalog">Смартфоны</a></li>
                            <li><a class="dropdown-item" href="?category=speaker#catalog">Умные колонки</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="#feedback">Связаться с нами</a></li>
                        </ul>
                    </li>
                    <li class="nav-item"><a class="nav-link" href="#about">О сервисе</a></li>
                    <li class="nav-item"><a class="nav-link" href="#faq">Вопросы</a></li>
                    <li class="nav-item"><a class="nav-link" href="#reviews">Отзывы</a></li>
                    <li class="nav-item"><a class="nav-link" href="#contacts">Контакты</a></li>
                </ul>
                <button class="btn btn--accent" type="button" data-bs-toggle="tooltip"
                    data-bs-title="Поможем подобрать товар за 5 минут">
                    <i class="bi bi-headset me-2"></i>Консультация
                </button>
            </div>
        </div>
    </nav>

    <!-- ===== OFFCANVAS ===== -->
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasMenu">
        <div class="offcanvas-header" style="background:var(--brand);">
            <h5 class="offcanvas-title text-white">Меню</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body">
            <ul class="nav flex-column gap-3">
                <li><a class="nav-link" href="#hero" data-bs-dismiss="offcanvas">Главная</a></li>
                <li><a class="nav-link" href="#catalog" data-bs-dismiss="offcanvas">Каталог</a></li>
                <li><a class="nav-link" href="#about" data-bs-dismiss="offcanvas">О сервисе</a></li>
                <li><a class="nav-link" href="#reviews" data-bs-dismiss="offcanvas">Отзывы</a></li>
                <li><a class="nav-link" href="#contacts" data-bs-dismiss="offcanvas">Контакты</a></li>
            </ul>
        </div>
    </div>

    <!-- ===== HERO / CAROUSEL ===== -->
    <section id="hero" class="py-4">
        <div class="container">
            <div id="heroCarousel" class="carousel slide hero" data-bs-ride="carousel" data-bs-interval="5000">
                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" class="active"></button>
                    <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
                </div>
                <div class="carousel-inner rounded-4 overflow-hidden">
                    <div class="carousel-item active">
                        <div class="hero__slide hero__slide--purple">
                            <div class="hero__content">
                                <h1 class="hero__title">1.8 млн товаров в 2 272 магазинах</h1>
                                <p class="hero__subtitle">Найди, сравни, выбери лучшую цену на электронику.</p>
                                <a href="#catalog" class="btn btn--accent btn-lg">Перейти к каталогу</a>
                            </div>
                        </div>
                    </div>
                    <div class="carousel-item">
                        <div class="hero__slide hero__slide--banner" style="background-image:url('img/banner.png');"></div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon"></span></button>
                <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon"></span></button>
            </div>
        </div>
    </section>

    <!-- ===== КАТАЛОГ (из БД) ===== -->
    <section id="catalog" class="catalog py-5">
        <div class="container">
            <h2 class="section-title mb-4">Каталог товаров</h2>

            <!-- Поиск и сортировка -->
            <div class="row mb-4 align-items-center g-3">
                <div class="col-md-6">
                    <form method="GET" action="#catalog" class="d-flex gap-2">
                        <input type="hidden" name="category" value="<?= htmlspecialchars($category) ?>">
                        <input type="hidden" name="sort" value="<?= htmlspecialchars($sort) ?>">
                        <input type="text" name="search" class="form-control" placeholder="Поиск по названию..."
                               value="<?= htmlspecialchars($search) ?>">
                        <button type="submit" class="btn btn--brand">Найти</button>
                    </form>
                </div>
                <div class="col-md-6 text-md-end">
                    <span class="me-2 text-muted small">Сортировка:</span>
                    <a href="?category=<?= urlencode($category) ?>&sort=id&search=<?= urlencode($search) ?>#catalog"
                       class="btn btn-sm btn-outline-secondary <?= $sort=='id' ? 'active' : '' ?>">По умолчанию</a>
                    <a href="?category=<?= urlencode($category) ?>&sort=price&search=<?= urlencode($search) ?>#catalog"
                       class="btn btn-sm btn-outline-secondary <?= $sort=='price' ? 'active' : '' ?>">По цене</a>
                    <a href="?category=<?= urlencode($category) ?>&sort=name&search=<?= urlencode($search) ?>#catalog"
                       class="btn btn-sm btn-outline-secondary <?= $sort=='name' ? 'active' : '' ?>">По имени</a>
                </div>
            </div>

            <!-- Категории -->
            <ul class="nav nav-pills catalog__tags mb-4">
                <li class="nav-item"><a class="nav-link <?= $category=='all' ? 'active' : '' ?>"
                    href="?category=all&sort=<?= $sort ?>&search=<?= urlencode($search) ?>#catalog">Все</a></li>
                <li class="nav-item"><a class="nav-link <?= $category=='smartphone' ? 'active' : '' ?>"
                    href="?category=smartphone&sort=<?= $sort ?>&search=<?= urlencode($search) ?>#catalog">Смартфоны</a></li>
                <li class="nav-item"><a class="nav-link <?= $category=='speaker' ? 'active' : '' ?>"
                    href="?category=speaker&sort=<?= $sort ?>&search=<?= urlencode($search) ?>#catalog">Умные колонки</a></li>
            </ul>

            <!-- Сетка товаров -->
            <div class="row g-4">
                <?php if (empty($products)): ?>
                    <div class="col-12 text-center py-5">
                        <div class="alert alert-light border">
                            <h4>🔍 Товары не найдены</h4>
                            <p class="mb-0 text-muted">Измените параметры поиска или категорию.</p>
                        </div>
                    </div>
                <?php else: ?>
                    <?php foreach ($products as $product): ?>
                        <?php $old = $product['discount'] > 0
                                ? $product['price'] / (1 - $product['discount']/100) : 0; ?>
                        <div class="col-sm-6 col-lg-4">
                            <div class="product-card h-100">
                                <div class="product-card__top">
                                    <button class="icon-btn" title="В избранное"><i class="bi bi-heart"></i></button>
                                    <button class="icon-btn" title="Сравнить"><i class="bi bi-bar-chart"></i></button>
                                </div>
                                <div class="product-card__img-wrapper">
                                    <img src="<?= htmlspecialchars($product['image_path']) ?>"
                                         alt="<?= htmlspecialchars($product['name']) ?>">
                                </div>
                                <div class="product-card__content">
                                    <h3 class="product-card__name"><?= htmlspecialchars($product['name']) ?></h3>
                                    <p class="product-card__desc"><?= htmlspecialchars($product['description']) ?></p>
                                    <div class="product-card__price-row">
                                        <span class="price-now"><?= number_format($product['price'], 0, ',', ' ') ?> ₽</span>
                                        <?php if ($product['discount'] > 0): ?>
                                            <span class="discount-badge"><i class="bi bi-caret-down-fill"></i> <?= $product['discount'] ?>%</span>
                                            <span class="price-old"><?= number_format($old, 0, ',', ' ') ?> ₽</span>
                                        <?php endif; ?>
                                    </div>
                                    <div class="product-card__meta">
                                        <div class="meta-box"><span class="meta-box__label">Рейтинг</span><span class="meta-box__val">⭐ <?= $product['rating'] ?></span></div>
                                        <div class="meta-box"><span class="meta-box__label">Отзывы</span><span class="meta-box__val"><?= number_format($product['reviews'], 0, ',', ' ') ?></span></div>
                                    </div>
                                    <button class="btn btn--accent w-100 btn--order"
                                            data-product="<?= htmlspecialchars($product['name']) ?>">В корзину</button>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

            <!-- Пагинация -->
            <?php if ($totalPages > 1): ?>
                <nav class="mt-5">
                    <ul class="pagination justify-content-center">
                        <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                            <li class="page-item <?= $i==$page ? 'active' : '' ?>">
                                <a class="page-link"
                                   href="?page=<?= $i ?>&category=<?= urlencode($category) ?>&sort=<?= $sort ?>&search=<?= urlencode($search) ?>#catalog"><?= $i ?></a>
                            </li>
                        <?php endfor; ?>
                    </ul>
                </nav>
            <?php endif; ?>

            <div class="mt-4 p-2 bg-light rounded small font-monospace text-muted">
                DEBUG: Category=<?= htmlspecialchars($category) ?> | Sort=<?= htmlspecialchars($sort) ?> |
                Search="<?= htmlspecialchars($search) ?>" | Page=<?= $page ?> | Total=<?= $totalItems ?>
            </div>
        </div>
    </section>

    <!-- ===== О СЕРВИСЕ / СТАТИСТИКА ===== -->
    <section id="about" class="about-stats py-5">
        <div class="container">
            <h2 class="section-title mb-2">Behoof помогает выбрать</h2>
            <p class="text-muted mb-4">покупку подходящую именно вам и по оптимальной цене</p>
            <div class="row g-4">
                <div class="col-6 col-lg-3"><div class="stats-card h-100">
                    <span class="stats-card__number">1 млн</span>
                    <span class="stats-card__desc">товаров в каталоге</span></div></div>
                <div class="col-6 col-lg-3"><div class="stats-card h-100">
                    <span class="stats-card__number">25 лет</span>
                    <span class="stats-card__desc">экспертизы на рынке</span></div></div>
                <div class="col-6 col-lg-3"><div class="stats-card h-100">
                    <span class="stats-card__number">50</span>
                    <span class="stats-card__desc">параметров сравнения</span></div></div>
                <div class="col-6 col-lg-3"><div class="stats-card h-100">
                    <span class="stats-card__number">25 млн</span>
                    <span class="stats-card__desc">отзывов покупателей</span></div></div>
            </div>
        </div>
    </section>

    <!-- ===== FAQ (Accordion) ===== -->
    <section id="faq" class="faq py-5">
        <div class="container">
            <h2 class="section-title mb-4">Ваши вопросы</h2>
            <div class="accordion" id="faqAccordion">
                <?php
                $faq = [
                    ['Как сравнить товары?', 'Добавьте товары в сравнение по иконке с графиком — мы покажем разницу по 50 параметрам.'],
                    ['Откуда берутся цены?', 'Мы агрегируем предложения 2 272 магазинов и показываем актуальную минимальную цену.'],
                    ['Это бесплатно?', 'Да, пользование сервисом Behoof полностью бесплатно для покупателей.'],
                    ['Можно ли доверять отзывам?', 'Отзывы оставляют только подтверждённые покупатели, фейки модерируются.'],
                ];
                foreach ($faq as $i => $f):
                    $id = 'faq' . ($i+1);
                ?>
                <div class="accordion-item">
                    <h3 class="accordion-header">
                        <button class="accordion-button <?= $i===0 ? '' : 'collapsed' ?>" type="button"
                            data-bs-toggle="collapse" data-bs-target="#<?= $id ?>"><?= $f[0] ?></button>
                    </h3>
                    <div id="<?= $id ?>" class="accordion-collapse collapse <?= $i===0 ? 'show' : '' ?>"
                         data-bs-parent="#faqAccordion">
                        <div class="accordion-body"><?= $f[1] ?></div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- ===== ОБРАТНАЯ СВЯЗЬ (PHPMailer + вложение) ===== -->
    <section id="feedback" class="feedback py-5">
        <div class="container">
            <h2 class="section-title mb-4 text-center">Написать в поддержку</h2>
            <div class="row g-4 align-items-start justify-content-center">
                <div class="col-lg-7">
                    <div class="feedback__form-wrapper">
                        <div id="formResponse" class="alert d-none" role="alert"></div>
                        <form id="contactForm" enctype="multipart/form-data">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">Ваше имя *</label>
                                    <input type="text" name="name" class="form-control" required placeholder="Иван Иванов">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Телефон *</label>
                                    <input type="tel" name="phone" class="form-control" required placeholder="+7 (___) ___-__-__">
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Email</label>
                                    <input type="email" name="email" class="form-control" placeholder="example@mail.ru">
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Вопрос</label>
                                    <textarea name="message" class="form-control" rows="3" placeholder="Опишите ваш вопрос..."></textarea>
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Прикрепить файл (скриншот, чек)</label>
                                    <input type="file" name="attachment" class="form-control" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx">
                                    <div class="form-text small text-muted">До 5 МБ. JPG, PNG, PDF, DOC.</div>
                                </div>
                                <div class="col-12">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="agreeCheck" required>
                                        <label class="form-check-label small" for="agreeCheck">Согласие на обработку персональных данных</label>
                                    </div>
                                </div>
                                <div class="col-12 mt-3">
                                    <button type="submit" class="btn btn--accent w-100 py-2" id="submitBtn">
                                        <span class="spinner-border spinner-border-sm d-none me-2" role="status"></span>
                                        Отправить
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ===== ОТЗЫВЫ ===== -->
    <section id="reviews" class="reviews py-5">
        <div class="container">
            <h2 class="section-title text-center mb-4">Отзывы покупателей</h2>
            <div class="row g-4">
                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <h4 class="card-title mb-3">Оставить отзыв</h4>
                            <form action="index.php" method="POST">
                                <div class="mb-3">
                                    <label class="form-label">Ваше имя</label>
                                    <input type="text" class="form-control" name="review_name" required placeholder="Алексей">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Ваш отзыв</label>
                                    <textarea class="form-control" name="review_text" rows="4" required placeholder="Поделитесь опытом покупки..."></textarea>
                                </div>
                                <button type="submit" class="btn btn--brand w-100"><i class="bi bi-send me-2"></i>Отправить</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-lg-8">
                    <div class="reviews-list">
                        <?php if (empty($messages)): ?>
                            <p class="text-muted text-center">Пока нет отзывов. Будьте первым!</p>
                        <?php else: ?>
                            <?php foreach ($messages as $msg): ?>
                                <div class="card mb-3 border-0 shadow-sm">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <h5 class="card-title mb-0">
                                                <i class="bi bi-person-circle me-2" style="color:var(--brand);"></i><?= $msg['name'] ?>
                                            </h5>
                                            <small class="text-muted"><?= $msg['date'] ?></small>
                                        </div>
                                        <p class="card-text"><?= nl2br($msg['text']) ?></p>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer id="contacts" class="footer py-5">
        <div class="container">
            <div class="row g-4">
                <div class="col-lg-3 col-md-6">
                    <a href="#" class="logo text-decoration-none d-inline-block mb-3"><span class="logo__mark">B</span>ehoof</a>
                    <nav class="footer__nav mt-2">
                        <a class="footer__link" href="#about">О сервисе</a>
                        <a class="footer__link" href="#catalog">Каталог</a>
                        <a class="footer__link" href="#faq">Вопросы</a>
                        <a class="footer__link" href="#contacts">Контакты</a>
                    </nav>
                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="footer__info-item"><i class="bi bi-geo-alt footer__icon"></i><div><strong>Адрес</strong><br>Москва, ул. Примерная, 1</div></div>
                    <div class="footer__info-item"><i class="bi bi-envelope footer__icon"></i><span>help@behoof.ru</span></div>
                    <div class="footer__info-item"><i class="bi bi-clock footer__icon"></i><span>Пн-Вс с 10:00 до 20:00</span></div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <p class="footer__status">Поддержка онлайн</p>
                    <button class="btn btn--accent mb-2">Заказать звонок</button>
                    <a href="tel:+74950000000" class="footer__phone text-decoration-none"><i class="bi bi-telephone me-2"></i>+7 495 000-00-00</a>
                </div>
                <div class="col-lg-3 col-md-6">
                    <p class="small mb-2" style="color:#bbb;">Подпишитесь на скидки</p>
                    <form id="subscribeForm">
                        <div class="input-group mb-2">
                            <input type="email" name="email" class="form-control" placeholder="Ваш email" required>
                            <button class="btn btn--accent" type="submit">OK</button>
                        </div>
                        <div id="subResponse" class="small mt-1" style="min-height:20px;"></div>
                    </form>
                </div>
            </div>
            <hr class="my-4" style="border-color:#333;">
            <div class="row align-items-center">
                <div class="col-md-6 text-center text-md-start">
                    <p class="footer__copyright mb-0">© Behoof, 2023. Поиск и сравнение электроники.</p>
                </div>
                <div class="col-md-6 text-center text-md-end">
                    <a href="#" class="footer__policy text-decoration-none">Политика конфиденциальности</a>
                </div>
            </div>
        </div>
    </footer>

    <!-- ===== TOAST ===== -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index:9999;">
        <div id="liveToast" class="toast" role="alert">
            <div class="toast-header" style="background:var(--brand);">
                <i class="bi bi-check-circle-fill me-2 text-white"></i>
                <strong class="me-auto text-white">Behoof</strong>
                <small class="text-white">только что</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">Товар добавлен в корзину!</div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script/script.js"></script>
</body>
</html>
