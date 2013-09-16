#include <string>
#include <node.h>
#include <syslog.h> // openlog, closelog, syslog, setlogmask

char identity[1024];

// First argument is identity string, second is facility integer
static v8::Handle<v8::Value> open(const v8::Arguments& args) {
  args[0]->ToString()->WriteAscii((char*) &identity);
  int facility = args[1]->ToInteger()->Int32Value();

  // Open log has no return value
  openlog(identity, LOG_PID | LOG_NDELAY, facility);

  return v8::True();
}

static v8::Handle<v8::Value> close(const v8::Arguments& args) {
  closelog();

  return v8::Undefined();
}

// First argument is severity level integer, second argument is message string
static v8::Handle<v8::Value> write(const v8::Arguments& args) {
  int severity = args[0]->ToInteger()->Int32Value();
  v8::String::Utf8Value message(args[1]->ToString());

  // Write to syslog
  syslog(severity, "%s", *message);

  return v8::Undefined();
}

// Register node module and create methods
void init(v8::Handle<v8::Object> target) {
  NODE_SET_METHOD(target, "open", open);
  NODE_SET_METHOD(target, "close", close);
  NODE_SET_METHOD(target, "write", write);
}

NODE_MODULE(syslog, init)
