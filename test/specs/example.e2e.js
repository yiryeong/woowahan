const LoginPage = require('../pageobjects/login.page');
const SecurePage = require('../pageobjects/secure.page');


describe('woowahan -> login Test', () => {
    // 존재하지 않는 계정으로 로그인 테스트
    it('login with invalid account', async () => {
        await LoginPage.open();
        await LoginPage.loginWithInvalid('test123@gmail.com', 'test');
    })

    //  신규지원자 등록
    it('new account', async () => {
        browser.url('https://career.woowahan.com/sign-in/')
        const elem = await $('a[href="/sign-up/"]')
        elem.click()
        await browser.pause(2000)
        await LoginPage.newAccount('test12345@gmail.com','Test12345!','테스트','19990909','여','01012341234');
    })

    // 비밀번호 찾기
    it('search password', async() => {
        browser.url('https://career.woowahan.com/sign-in/')
        const elem = await $('a[href="/sign-in/search"]')
        elem.click()
        await browser.pause(2000)
        await LoginPage.searchPassword('테스트', 'test1234@gmail.com');
    })

    // 이메일 찾기
    it('search email', async() => {
        browser.url('https://career.woowahan.com/sign-in/')
        const elem = await $('a[href="/sign-in/search"]')
        elem.click()
        await browser.pause(2000)
        await LoginPage.searchEmail('테스트', '19990909', '01012341234');
    })

    // 정상 회원가입한 계정으로 로그인 테스트
    it('login with valid account', async () => {
        await LoginPage.open();
        expect(browser).toHaveTitle('우아한형제들 인재영입');
        await LoginPage.loginWithValid('liling890410@gmail.com', 'Liling890410!');
    })
});

