import nodemailer from 'nodemailer'

export async function sendAdminNotification(userInfo: {
  name: string
  email: string
  registrationDate: Date
}) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.naver.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  // 관리자 이메일 주소
  const adminEmail = process.env.ADMIN_EMAIL || 'webstoryboy@naver.com'

  const mailOptions = {
    from: `"byeolstar.com" <${process.env.EMAIL_USER}>`,
    to: adminEmail, // 관리자 이메일로 발송
    subject: '🎉 byeolstar 새로운 회원가입 알림',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 새로운 회원가입!</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">새로운 사용자가 가입했습니다</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0; font-size: 20px;">회원 정보</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">이름:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d;">${
                  userInfo.name
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #495057;">이메일:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #6c757d;">${
                  userInfo.email
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #495057;">가입일시:</td>
                <td style="padding: 10px 0; color: #6c757d;">${userInfo.registrationDate.toLocaleString(
                  'ko-KR'
                )}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
            <p style="margin: 0; color: #1565c0; font-size: 14px;">
              <strong>💡 참고:</strong> 관리자 패널에서 새로운 회원의 상세 정보를 확인하실 수 있습니다.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              이 메일은 자동으로 발송된 알림입니다. 회신하지 마세요.
            </p>
          </div>
        </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`관리자 알림 이메일이 ${adminEmail}로 전송되었습니다.`)
    console.log(`새 회원: ${userInfo.name} (${userInfo.email})`)
  } catch (error) {
    console.error('관리자 알림 이메일 전송 실패:', error)
    throw new Error('관리자 알림 이메일 전송 실패')
  }
}
