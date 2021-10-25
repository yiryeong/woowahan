const Page = require('./page')
const EC = require('wdio-wait-for')


/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    get inputUserEmail () { return $('#userEmail') }
    get inputPassword () { return $('#userPassword') }
    get btnSubmit () { return $('button[type="submit"]') }
    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using userid and password
     */


    // 존재하지 않는 계정으로 로그인 테스트
    async loginWithInvalid (email, password) {
        const loginA = await $('a[href="/sign-in"]')
        loginA.click()
        await this.inputUserEmail.click()
        await $('main.container').click()
        const elem1 = $('div.input-form-error-requirements')
        expect(elem1).toHaveText('이메일은 필수 입력값입니다.')
        await this.inputUserEmail.setValue(email)

        await this.inputPassword.click()
        await $('main.container').click()
        const elem2 = $('div.input-form-error-requirements')
        expect(elem2).toHaveText('이메일은 필수 입력값입니다.')
        await this.inputPassword.setValue(password)

        await this.btnSubmit.click()
        browser.waitUntil(EC.alertIsPresent(), { timeout: 5000, timeoutMsg: '이메일 또는 비밀번호가 올바르지 않습니다.\n다시 확인해주세요.' })
        await $('button=확인').click()
    }


    // 회원가입한 계정으로 로그인 테스트
    async loginWithValid (email, password) {
        const loginA = await $('a[href="/sign-in"]')
        loginA.click()
        await this.inputUserEmail.setValue(email)
        await this.inputPassword.setValue(password)
        await this.btnSubmit.click()
    }


    // 신규지원자 등록
    async newAccount (email, password, name, birthday, gender, phoneNo) {
        // 이메일
        const title = await $('h2.title')
        expect(title).toHaveText(' 신규지원자 등록 ')
        const inputEmail = await $('#applicantEmail')
        inputEmail.click()
        title.click()
        const elem1 = $('div.input-form-error-requirements')
        expect(elem1).toHaveText('이메일은 필수 입력값입니다.')
        await inputEmail.setValue(email)

        // 비밀번호
        const inputPass = await $('#applicantPassword')
        inputPass.click()
        title.click()
        expect(elem1).toHaveText(' 비밀번호는 필수 입력값입니다. ')
        await inputPass.setValue(password)

        // 비밀번호 확인
        const inputPassCheck = await $('#applicantPassword')
        inputPassCheck.click()
        title.click()
        expect(elem1).toHaveText(' 비밀번호 확인은 필수 입력값입니다. ')
        await inputPassCheck.setValue(password)
        expect('p.input-form-error-requirements.valid').toHaveText(' 비밀번호가 일치합니다. ')

        // 이름(한글)
        const inputName = await $('#applicantName')
        inputName.click()
        title.click()
        expect(elem1).toHaveText(' 이름 (한글)는 필수 입력값입니다. ')
        await inputName.setValue(name)

        // 생년월일
        const inputBirthday = await $('#applicantBirthDay')
        inputBirthday.click()
        title.click()
        expect(elem1).toHaveText(' 생년월일은 필수 입력값입니다. ')
        await inputBirthday.setValue(birthday)

        // 남 / 여
        const checkGender = await $('label=여')
        if(gender === '남'){
            checkGender = await $('label=남')
        }

        checkGender.click()
        expect(checkGender).toBeSelected()

        // 휴대폰 번호
        const inputPhoneNo = await $('#applicantMobileNumber')
        inputPhoneNo.click()
        title.click()
        expect(elem1).toHaveText(' 휴대폰 번호는 필수 입력값입니다. ')
        await inputPhoneNo.setValue(phoneNo)

        // 필수
        const submitButton = await $('button= 등록하기 ')
        expect(submitButton).toBeDisabled()
        const checkAgree = await $('#checkAgree')
        checkAgree.click()
        expect(checkAgree).toBeSelected()
        expect(submitButton).toBeEnabled()

        // 등록하기
        browser.back()
        await browser.pause(2000)
    }


    // 비밀번호 찾기
    async searchPassword(name, email){
        const findEmail = await $('a[href="/sign-in/search/email"]')
        const findPassword = await $('a[href="/sign-in/search/password"]')

        // 가입하지 않은 이메일 입력
        findPassword.click()
        expect('div.login-search-notice > ul > li:nth-child(2)').toHaveText(' 1시간 이내에 완료하지 않을 시 비밀번호 찾기를 다시 진행해야 합니다. ')
        const inputEmail = await $('#isEmail')
        const main = await $('main.container.wrap-centered')
        const elem = await $('div.input-form-error-requirements')
        inputEmail.click()
        main.click()
        expect(elem).toHaveText(' 이메일은 필수 입력값입니다. ')
        inputEmail.setValue('test12345@gmail.com')

        const resetPassword = await $('button[type="submit"]')  // 비밀번호 재설정 버튼
        expect(resetPassword).toBeDisabled()
        const inputName = await $('#isNickName')
        inputName.click()
        main.click()
        expect(elem).toHaveText(' 이름은 필수 입력값입니다. ')
        inputName.setValue(name)
        expect(resetPassword).toBeEnabled()

        await browser.pause(2000)
        resetPassword.click()
        browser.waitUntil(EC.alertIsPresent(), { timeout: 5000, timeoutMsg: ' 일치하는 계정정보가 없습니다. ' })
        await $('button.btn-confirm.btn-primary').click()  // 팝업창에 확인 버튼
        inputEmail.setValue(email)

        await browser.pause(2000)
        resetPassword.click()
        browser.waitUntil(EC.alertIsPresent(), { timeout: 5000, timeoutMsg: email+'으로 메일이 발송되었습니다.\n몇 분 후에도 이메일이 확인되지 않으면 재시도 해주시기 바랍니다.' })
        await $('button.btn-confirm.btn-primary').click()  // 팝업창에 확인 버튼
    }


    // 이메일 찾기
    async searchEmail(name, birthday, phoneNo){
        const findEmail = await $('a[href="/sign-in/search/email"]')
        const findPassword = await $('a[href="/sign-in/search/password"]')

        const inputName = await $('#isNickName')
        const main = await $('main.container.wrap-centered')
        const elem = await $('div.input-form-error-requirements')
        inputName.click()
        main.click()
        expect(elem).toHaveText(' 이름은 필수 입력값입니다. ')
        inputName.setValue(name)

        const inputBirthday = await $('#isBirth')
        inputBirthday.click()
        main.click()
        expect(elem).toHaveText(' 생년월일은 필수 입력값입니다. ')
        inputBirthday.setValue(birthday)


        const findEmailBtn = await $('button[type="submit"]')  // 이메일 찾기 버튼
        expect(findEmailBtn).toBeDisabled()
        const inputPhoneNo = await $('#isPhone')
        inputPhoneNo.click()
        main.click()
        expect(elem).toHaveText(' 이름은 필수 입력값입니다. ')
        inputPhoneNo.setValue('01011111111')
        expect(findEmailBtn).toBeEnabled()

        await browser.pause(2000)
        findEmailBtn.click()
        browser.waitUntil(EC.alertIsPresent(), { timeout: 5000, timeoutMsg: '일치하는 계정 정보가 없습니다.' })
        await $('button.btn-confirm.btn-primary').click()  // 팝업창에 확인 버튼
        inputPhoneNo.setValue(phoneNo)

        await browser.pause(2000)
        findEmailBtn.click()
        expect('div.title').toHaveText(' 이메일 찾기 완료 ')
        expect('button.btn-black').toBeEnabled()   // 비밀번호 찾기 버튼
        expect('button.btn-primary.router-link-active').toBeEnabled()   // 로그인 버튼
    }


    /**
     * overwrite specifc options to adapt it to page object
     */
    open () {
        return super.open();
    }
}

module.exports = new LoginPage();
